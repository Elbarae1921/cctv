## Introduction

A simple web app that displays your facecam feed (if you have a facecam) in your browser using websockets and opencv.


## configuration

In order for the `opencv4nodejs` package to work you will need to have `cmake` installed as well as a c/c++ compiler (gcc/g++) and other things I guess checkout their [repo](https://github.com/justadudewhohacks/opencv4nodejs).
You will also need to have Typescript installed globally to run and compile the files  (`sudo` ?)`npm i -g typescript`.

run
```
npm install
```
to install all the dependencies in package.json

Scripts are already set in package.json so use `npm run dev` or `npm start` (if you compiled) to start the app then go to http://localhost:5000.
