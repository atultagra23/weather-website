const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();

//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views locations
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirPath));

// app.com
app.get('', (req, res) => {
    res.render('index', {title : 'Weather App', name : 'Atul Tagra'});
});

app.get('/about', (req, res) => {
    res.render('about', {title : 'About', name : 'Atul Tagra'});
});

app.get('/help', (req, res) => {
    res.render('help', {title : 'Help', name : 'Atul Tagra', message : 'This is a help message'});
});

// app.com/weather
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.render('404', {title : '404', name : 'Atul Tagra', errorMessage : 'Please enter an address'});
    }

    geoCode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.render('404', {title : '404', name : 'Atul Tagra', errorMessage : error});
        }
        
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.render('404', {title : '404', name : 'Atul Tagra', errorMessage : error});
            }
    
            res.send({
                address : req.query.address,
                forecast : forecastData.message,
                location
            });
        });
    });
});

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error : "You must provide a search term"
        });
    }
    res.send({
        products : []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {title : 'Help', name : 'Atul Tagra', errorMessage : 'Help article not found'});
});

app.get('*', (req, res) => {
    res.render('404', {title : '404', name : 'Atul Tagra', errorMessage : 'My 404 page'});
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});