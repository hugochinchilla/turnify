# Turnify

Experience spotify as a boomer.

## About this project

This project aims to create an alternative Spotify player that forces you to listen to music instead of consume it.

You will have to select an album and listen as an LP, this means:
 
 * You listen to approximately 20 minutes of music and then the playback stops.
 * Either you flip the vinyl and listen to the other side, or you switch to another LP.
 * There is no playlists.
 * There is no algorithmic music suggestion.
 * You can save LP in your digital collection.

## Project status

This is in a very basic state, you will be able to search albums and play them, but this is a still in progress application.

* [x] Search albums
* [x] Start playback of an album
* [ ] Show album songs
* [ ] Divide album songs by LP sides
* [ ] Stop playback when reaching the end of the LP side
* [ ] Limit search results to actual LPs
* [ ] Implement search pagination
* [ ] Make the UI pretty
* [ ] Make song seeking imprecise

Things that I would like to add, but probably violate Spotify terms of use, so I need to ask permission first:

* [ ] Emulate vinyl crackle
* [ ] Prepend a few seconds of "vinyl silence" before starting playback when an album is selected or LP side is switched.
* [ ] Append a few seconds of "vinyl silence" at the end of an LP side.
* [ ] Show a picture of the LP spinning, they can be found on Internet Archive.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:7878](http://localhost:7878) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


All other [create-react-app](https://github.com/facebook/create-react-app) scripts are also available.
