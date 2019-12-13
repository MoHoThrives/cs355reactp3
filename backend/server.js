const mongoose = require('mongoose');
const request = require('request');
const db = require('./queries')
const express = require("express");
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const path  = require('path');

const bodyParser = require('body-parser')

// process is a global object.
const port = process.env.PORT || 5000;
//cors: cross origin resource sharing, allowed ajax request access resource from remote host.
const cors = require('cors');
//dotenv: load environment variables form a .env file
require('dotenv').config();

// middleware
app.use(cors());
//allow us to parse json, this should work but not.
app.use(express.json());
//this is working.
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }));


const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('backend/build'));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname, 'backend', 'build', 'index.html'));
    });
};

/** require the files */
const searchRouter = require('./routes/search');
const pageRouter = require('./routes/page');
// const Crawler = require("js-crawler");

// const crawler = new Crawler().configure({
//     depth: 2,
// });
// crawler.crawl("https://www.wikipedia.org/", function(page) {
//     console.log(page.url);
// });

/** go to /custom, load methods in searchRouter */
app.use('/custom', searchRouter);
app.use('/admin', pageRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));

