// Require Files - dotenv to help get ignored/hidden variables in .env file.
//                  - keys.js > exports these now process.env variables
//                  - More Notes at end of page >
require("dotenv").config();
// ==+==================+==

// Require Files & Packages, store as variables
let keys = require("./assets/keys.js");
// let questions = require("./assets/questions");

const inquirer = require("inquirer");
let Spotify = require("node-spotify-api");
let axios = require("axios");
// let fs = require("fs");
// let moment = require('moment');

// >> fs
// fs is a core Node package for reading and writing files
// >> moment
// moment().format();
// console.log("moment = ", moment)

// Questions Array for Inquirer Prompt
const questions = [
    {
        type: "list",
        name: "doingWhat",
        message: "\n[LIRI] - How can I help?\n\n",
        choices: ["Search for Artist's Concert", "Find Album on Spotify", "Find Song on Spotify", "Look up Movies", "do-what-it-says.."]
    }, {
        type: "input",
        name: "userInput",
        message: "[LIRI] - Okay, enter search here: ",
        validate: function validateFirstName(name) {
            console.log("\n \n Please enter Name or Title - \n Name or Title should be a well known Artist, Album, Track (song name), Actor/Actress or Movie.\n")
            return name !== '';
        }
    }]

inquirer.prompt(questions)
    .then(function (answers) {

        let choice = answers.doingWhat
        let searchTerm = answers.userInput
        console.log(`\n[LIRI] - Okay, going to (${choice}) - (${searchTerm})\n`)

        // Type is a key from what choice was selected, initially empty
        let type = ""

        // Handle User Selection on Question1, and then user search input from Question2
        switch (choice) {
            // - if user selects Song/Artist - use Spotify-Node-API - display Song/Artist info
            // - if user selects Actor/Actress or Movie - Axios Get request to OMDB API - display info
            // - if user selects conert, get info from Bands in Town
            // - if user selects DO-WHAT-I-SAY option  - read the random.txt file's contents via file system (fs)
            case "Search for Artist's Concert":
                type = "artist"
                break;
            case "Find Song on Spotify":
                type = "track"
                break;
            case "Find Album on Spotify":
                type = "album"
                break;
            case "Look up Movies":
                type = "movie"
                break;
            case "do-what-it-says..":
                type = "movie"
                break;
        }

        // AXIOS -  OMDB - The Open Movie Database
        // case: type = movie
        if (type === "movie") {
            const movieName = answers.userInput

            var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

            axios.get(queryUrl)
                .then(
                    // Display Searched results from OMDB
                    function (response) {
                        let movie = response.data
                        console.log(`[LIRI] - Here are the search results for ${searchTerm}\n`)
                        // console.log("movie = ", movie)
                        console.log("==+=======================+==\n")
                        console.log(`Title:   ${movie.Title}\n`)
                        console.log(`Movie Released: ${movie.Released}`)
                        console.log(`IMDB Movie Rating: ${movie.Ratings[0].Value}`)
                        console.log(`Rotten Tomatoes Rating: ${movie.Ratings[1].Value}\n`)
                        console.log(`Actors: ${movie.Actors}`)
                        console.log(`Country: ${movie.Country}`)
                        console.log(`Language: ${movie.Language}\n`)
                        console.log(`Plot: ${movie.Plot}`)
                        console.log("\n==+=======================+==\n")
                    })
                .catch(function (error) {
                    // If the request with axios is successful
                    if (error.response) {
                        console.log("error.response =", error.response)
                    } else {
                        console.log("Error = ", error)
                    }
                });

        }

        // case: type = movie
        if (type === "artist") {
            const artist = answers.userInput

            var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

            axios.get(queryUrl)
                .then(
                    // Display Searched results from OMDB
                    function (response) {
                        let artistData = response
                        console.log("artistData = ", artistData)
                        console.log(`[LIRI] - Here are the search results for ${searchTerm}\n`)
                        // console.log("movie = ", movie)
                        console.log("==+=======================+==\n")



                        // console.log(`Title:   ${movie.Title}\n`)
                        // console.log(`Movie Released: ${movie.Released}`)
                        // console.log(`IMDB Movie Rating: ${movie.Ratings[0].Value}`)
                        // console.log(`Rotten Tomatoes Rating: ${movie.Ratings[1].Value}\n`)
                        // console.log(`Actors: ${movie.Actors}`)
                        // console.log(`Country: ${movie.Country}`)
                        // console.log(`Language: ${movie.Language}\n`)
                        // console.log(`Plot: ${movie.Plot}`)



                        
                        // console.log("\n==+=======================+==\n")
                    })
                // .catch(function (error) {
                //     // If the request with axios is successful
                //     if (error.response) {
                //         console.log("error.response =", error.response)
                //     } else {
                //         console.log("Error = ", error)
                //     }
                // });

        }

        // SPOTIFY
        // cases: type = track, albumn, or artist
        else if (type === "track" || type === "album" || type === "artist") {

            // =======
            // Handle Artist, Albumn and Track Searches with Node-Spotify-Api
            let spotify = new Spotify(keys.spotify);

            // Node-Spotify-Api - search function
            spotify.search({ type: `${type}`, query: `${searchTerm}`, limit: 1 }, function (err, data) {
                // type: 'artist OR album OR track'
                // query: 'answers.userInput'
                if (err) {
                    return console.log('Error occurred: ' + err);
                } else {
                    // console.log(`GOOD RESPONSE SPOTIFY, type = ${type}  and query = ${searchTerm}\n`)
                    console.log(`[LIRI] - Here are the search results for ${searchTerm}\n`)

                    // Handle Good response from Spotify
                    if (type === "artist") {
                        // console.log(`data.artists = `, data.artists)
                        let searched = data.artists.items[0]

                        console.log("==+=======================+==\n")
                        console.log(`Artist: ${searched.name}`)
                        console.log(`Popularity: ${searched.popularity}\n`)
                        console.log(`Spotify Artist uri =  ${searched.uri}\n`)
                        console.log(`Spotify href =  ${searched.href}\n`)
                        console.log("==+=======================+==")
                    } else if (type === "track") {
                        // console.log(` ...testing .. data.tracks......... = `, data.tracks.items[0].album)
                        let searched = data.tracks.items[0]

                        console.log("==+=======================+==\n")
                        console.log(`Song Title: ${searched.name}\n`)
                        console.log(`Popularity: ${searched.popularity}\n`)
                        console.log(`Album: ${searched.album.name}\n`)
                        console.log(`Featured Artist: `)
                        for (let i = 0; i < searched.artists.length; i++) {
                            console.log(" -" + searched.artists[i].name)
                        }
                        console.log(`\nPreview Song URL: ${searched.preview_url}\n`)
                        console.log("==+=======================+==")
                    } else if (type === "album") {
                        let searched = data.albums
                        // console.log(`data.albums = `, searched)
                        console.log("==+=======================+==\n")
                        console.log(`Album Name: ${searched.items[0].name}\n`)
                        console.log("Featured Artist: ")
                        for (let i = 0; i < searched.items[0].artists.length; i++) {
                            console.log(" -" + searched.items[0].artists[i].name)
                        }
                        console.log(`\nNumber of Songs: ${searched.items[0].total_tracks}\n`)
                        console.log("==+=======================+==")
                    } else {
                        console.log("else...loop ended.. data = ", data)
                    }

                }
            });


        }

    })
    .catch(function (error) {
        if (error.response) {
            console.log("error.response =", error.response)
        } else {
            console.log("Error = ", error)
        }
    });



    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // TODO: 
    //  .    * Need to add Bands in Town
    //   .   * 08-Modularization
    //  1.
    //  2. add movie/band response info as per HW description
    //  3. add Bands in Town to Axios Get call > get API key for axios.. hide key in .env? - Add File Name to .gitignore.  >> .env May expose all variables to process.env so I could just keep .gitignore as is..
    //  4.
    //  6. LINK TO PORTFOLIO, maybe GIF on my portfolio
    //  7.
    //  8.
    //  5. add error handling to .env hidden response >
    //      const result = dotenv.config()
    //      if (result.error) {
    //        throw result.error
    //      }
    //      console.log(result.parsed)

    // ==+=====================================+==

    // ==+=====================================+==
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // * This file will be used by the `dotenv` package to set what are known as environment variables to the global `process.env` object in node. These are values that are meant to be specific to the computer that node is running on, and since we are gitignoring this file, they won't be pushed to github &mdash; keeping our API key information private.

    // * If someone wanted to clone your app from github and run it themselves, they would need to supply their own `.env` file for it to work, with the following contents:

    //  ```js
    // # Spotify API keys
    // SPOTIFY_ID=your-spotify-id
    // SPOTIFY_SECRET=your-spotify-secret
    // ```
    //          5. Make a file called `random.txt`.

    // * Inside of `random.txt` put the following in with no extra characters or white space:

    // * spotify-this-song,"I Want it That Way"


    // This will show the following information about the track in your terminal/bash window
    // * Artist(s) * The track's name * A preview link of the track from Spotify 
    // * The album that the track is from * If no track is provided then your program will default to "The Sign" by Ace of Base.

    // ==+=====================================+==

    // This block of code will read from the "movies.txt" file.
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the letiable "data"
    // fs.readFile("movies.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
    //   if (error) {
    //     return console.log(error);
    //   }

        // We will then print the contents of data
    //   console.log(data);

        // Then split it by commas (to make it more readable)
    //   var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
    //   console.log(dataArr);

    // });