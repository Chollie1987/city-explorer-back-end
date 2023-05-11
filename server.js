'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');

// initilizing express
const app = express();

// middleware to allow open access with cors
app.use(cors())

const PORT = process.env.PORT;

app.get('/', (request, response) => {
    console.log('in the home route')
    response.status(200).send('Hey your default route is working')
});

//http://localhost:3001/shoppingList
//http://render-app-name/shoppingList
app.get('/weather', (request, response, next) => {
    const { searchQuery } = request.query;

    try {
     const city = weatherData.find(c => searchQuery.toLowerCase() === c.city_name.toLowerCase())
     if (!city) {response.status(500).send('invalid city')
    return
    }
     const cityForcast = city.data.map(f => new Forcast(f))
     response.status(200).send(cityForcast)
    }
    catch (error) {
        next(error);
    }

});

class Forcast {
    constructor(obj) {
        this.date = obj.datetime;
        this.description = obj.weather.description
    }
}

app.get('*', (req, res) => {
    res.status(404).send('Not found')
});

app.use((error, req, res, next) => {
    res.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));