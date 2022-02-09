'use strict'

const express = require ("express");
const app = express();

const dataMove = require("./Movie Data/data.json");
app.get("/", homeHandler);
app.get("/favorite", favoriteHandler);

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


function favoriteHandler(req,res){
    res.status(200).send("Welcome to Favorite Page");
}

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(401).send('Something broke!')
})

app.listen(3001, ()=>{
    console.log("Server run");
});

