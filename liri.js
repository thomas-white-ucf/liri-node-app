// "main": "keys.js",
//   "dependencies": {
//     "axios": "^0.19.0",
//     "dotenv": "^8.0.0",
//     "inquirer": "^6.5.1",
//     "moment": "^2.24.0",
//     "node-spotify-api": "^1.1.1"
// ==+=====================================+==

// TODO: 
//  1.
//  2.
//  3. add Bands in Town to Axios Get call > get API key for axios.. hide key in .env? - Add File Name to .gitignore.  >> .env May expose all variables to process.env so I could just keep .gitignore as is..
//  4.
//  5.


// ==+=====================================+==


// Require Files - dotenv to help get ignored/hidden variables in .env file.
//                  - keys.js > exports these now process.env variables
//                  - More Notes at end of page >
require("dotenv").config();

// Require Files, store as variables
var keys = require("./keys.js");
var axios = require("axios");

var spotifyKeys = keys.spotify
// make with consructor >> 
// var spotify = new Spotify(keys.spotify);
// var spotifyKeys = new Spotify(keys.spotify);

// var moment = require('moment');
// moment().format();
// console.log("moment = ", moment)

console.log("spotifyKeys = ", spotifyKeys)
// console.log("new .. constructor Spotify =", Spotify)





// ==+=====================================+==

//    Axios get movies
//   ==+===========+==
// Grab or assemble the movie name and store it in a variable called "movieName"
var movieName = process.argv[2];
console.log("movieName = ", movieName)
// ...

// Then run a request with axios to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

// Then create a request with axios to the queryUrl
axios.get(queryUrl)
    .then(
        // Then log the Release Year for the movie
        function (response) {
            console.log("The movie's year of release: " + response.data.Year);
        })
    .catch(function (error) {

        // If the request with axios is successful
        if (error.response) {
            console.log("error.response =", error.response)
        }

        else {
            console.log("Error = ", error)
        }
    });



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

// 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
