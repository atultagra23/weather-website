const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/52f099b76056b34e3f4232f473897c48/' + latitude + ',' + longitude + '?units=si';
    request({url, json : true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to weather services', undefined);
        } else if(body.error){
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, {
                message : body.daily.data[0].summary + 'It is currently ' + body.currently.temperature + ' degrees outside with ' + body.currently.precipProbability + '% chance of rain'
            });
        }
    });
};

module.exports = forecast;