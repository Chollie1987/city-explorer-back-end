'use strict'

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');
const axios = require('axios');

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
app.get('/weather', async (request, response, next) => {
    const { lat,lon } = request.query;

    try {
        let url = `http://api.weatherbit.io/v2.0/forecast/daily?&key=${process.env.WEATHERBIT_KEY}&lat=${lat}&lon=${lon}&days=5`
        console.log(url);
      let res = await axios.get(url)
      let formattedData = res.data.data.map(day => new Forecast(day))
      response.status(200).send(formattedData)
    //  const city = weatherData.find(c => searchQuery.toLowerCase() === c.city_name.toLowerCase())
    //  if (!city) {response.status(500).send('invalid city')
    // return
    }
    //  const cityForcast = city.data.map(f => new Forcast(f))
    //  response.status(200).send(cityForcast)
    catch (error) {
        next(error);
    }

});

app.get('/movies', async (request, response, next) => {
    const city = request.query.city
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_KEY}&query=${city}`
    const results = await axios.get(url)
    console.log(results.data);
    const movieArray = results.data.results.map(movie => {
        return new Movie(movie) 
    })
    response.status(200).send(movieArray.splice(0, 4))
});

class Movie {
    constructor(obj) {
       this.title = obj.title
       this.overview = obj.overview
       this.average_votes = obj.vote_average
       this.total_votes = obj.vote_count
        this.image_url =`https://image.tmdb.org/t/p/w500${obj.poster_path}`
       this.popularity = obj.popularity
       this.released_on = obj.release_date
    }
}

class Forecast {
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