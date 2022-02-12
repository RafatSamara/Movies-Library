'use strict'

const express = require ("express");
const app = express();
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

const dataMove = require("./Movie Data/data.json");

app.get("/", homeHandler);
app.get("/favorite", favoriteHandler);
app.get("/trending", trendingHandler);
app.get("/search", searchHandler);

// For Task 13 //
const pg = require("pg");
const bodyParser = require("body-parser");
const client = new pg.Client("postgres://student:x@localhost:9999/student");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add Move Handlet
app.post("/addMovie", addMovieHandler);
function addMovieHandler (req, res){
    const body = req.body;
    const sql = `INSERT INTO Movie (title, poster_path, overview) VALUES($1, $2, $3) RETURNING * ;`;
    const values = [movie.title, movie.poster_path, movie.overview];
    client.query(sql, values).then(()=>{
        return res.status(200).send("Success")
    });
}

// Get Movies Handler
app.get("/getMovies", getMoviesHandler);
function getMoviesHandler (req, res){
    const sql = `select * from Movie`;
    client.query(sql).then(data=>{
        return res.status(200).json(data.rows)
    });
}

// //

// For Task 14 //

app.get("/getMovie/id", getMovieHandler);
app.put("/UPDATE/id", UPDATEMovieHandler);
app.delete("/DELETE/id", DELETEMovieHandler);

function getMovieHandler(req, res) {
    const movie_id = req.param.id;
    const queryString = `SELECT * FROM Movie WHERE id = ${movie_id}`;
    client.query(queryString).then((data) => {
        res.status(200).json(data.rows);
      }).catch((err) => {
        errorHandler(err, req, res);
      });
  }

  function UPDATEMovieHandler(req, res) {
    const movie_id = req.param.id, movie = req.body;
    const queryString = `UPDATE Movie SET title = $1, poster_path = $2, overview = $3 WHERE id = ${movie_id} RETURNING;`;
    let values = [movie.title, movie.poster_path, movie.overview];
  
    client.query(queryString).then((data) => {
        res.status(200).json(data.rows);
      }).catch((err) => {
        errorHandler(err, req, res);
      });
  }

  function DELETEMovieHandler(req, res) {
    const movie_id = req.param.id;
    const queryString = `DELETE FROM Movie WHERE id = ${movie_id}`;
    client.query(queryString).then(() => {
        res.status(200).json(data.rows);
      }).catch((err) => {
        errorHandler(err, req, res);
      });
  }

//

function Move(title, original_language, original_title, poster_path, video, vote_average, overview, release_date, vote_count, id, adult, backdrop_path, popularity, media_type){
    this.title = title;
    this.original_language = original_language;
    this.original_title = original_title;
    this.poster_path = poster_path;
    this.video = video;
    this.vote_average = vote_average;
    this.overview = overview;
    this.release_date = release_date;
    this.vote_count = vote_count;
    this.id = id;
    this.adult = adult;
    this.backdrop_path = backdrop_path;
    this.popularity = popularity;
    this.media_type = media_type;
}

function homeHandler (req, res){
    let move = new Move(dataMove.title, dataMove.original_language, dataMove.original_title, dataMove.poster_path,
              dataMove.video, dataMove.vote_average, dataMove.overview, dataMove.release_date, dataMove.vote_count,
              dataMove.id, dataMove.adult, dataMove.backdrop_path, dataMove.popularity, dataMove.media_type);
    res.status(200).json(move);
}

function favoriteHandler(req, res){
    res.status(200).send("Welcome to Favorite Page");
}

function trendingHandler(req, res){
    let moves = [];
    axios.get('https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US').then(value =>{
        value.data.results.forEach(element => {
            let move = new Move(
                element.title,
                element.original_language,
                element.original_title,
                element.poster_path,
                element.video,
                element.vote_average,
                element.overview,
                element.release_date,
                element.vote_count,
                element.id,
                element.adult,
                element.backdrop_path,
                element.popularity,
                element.media_type
            )
                moves.push(move);
        });
        return res.status(200).json(moves);
    })
}

function searchHandler(req, res){
    let searchQuery = req.query.search;
    let movies = [];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=37ddc7081e348bf246a42f3be2b3dfd0&page=1`).then((value) => {
        value.data.results.forEach((movie) => {
            movies.push(movie);
        });
        return res.status(200).json(movies);
    });
}

app.use("*", errorNotFound);
function errorNotFound(req,res){
    res.status(404).send("Page Not Found !");
}

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(401).send('Something broke!')
})

app.listen(9999, ()=>{
    console.log("Server run");
});

