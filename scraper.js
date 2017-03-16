// Scraping and Saving Data:
//     The scraper should get the price, title, url and image url from the product page and save this information into a CSV file.
//     The information should be stored in an CSV file that is named for the date it was created, e.g. 2016- 11-21.csv.
//     Assume that the the column headers in the CSV need to be in a certain order to be correctly entered into a database. They should be in this order: Title, Price, ImageURL, URL, and Time
// The CSV file should be saved inside the ‘data’ folder.

'use strict';
const cheerio = require('cheerio');
const request = require('request');
const json2csv = require('json2csv');
const fs = require('fs');
const rootURL = "http://www.shirts4mike.com/shirts.php";

// Checks if the data folder exists and creates it if not
// Used info from https://blog.raananweber.com/2015/12/15/check-if-a-directory-exists-in-node-js/
function folderCheck() {
    try {
        fs.statSync("data");
    } catch(error) {
        fs.mkdirSync("data");
    }
}

folderCheck();
getURLs(rootURL);

// issue request to root site to get the links to t-shirt pages, having each pushes to an array
// Used this tutorial: http://www.netinstructions.com/simple-web-scraping-with-node-js-and-javascript/
function getURLs(rootURL) {
    let links = [];
    const baseURL = "http://www.shirts4mike.com/";
    request(rootURL, function (error, response, body) {
        if(error) {
            // Shows error that occurred
            console.log(`Could not connect to ${rootURL} to get the data due to error: ${error}`);
        } else {
            let shirtLinks = [];
            var $ = cheerio.load(body);
            // Push each link to the array so it can be used in next request
            $(".products li a").each(function(index) {
                const link = $(this).attr('href');
                links.push(baseURL + link);
            });
            // Show links array
            console.log(links.length);
            getShirtInfo(links);
        }
    });
}

function getShirtInfo(links) {
    let jsonData = [];
    for(let i = 0; i < links.length; i++) {
        // Make request
        // Check body for:
            // price, title, url and image url
        // Make JSON object with properties
        // Push JSON object to jsonData array
    }
}

function makeCSVFromJSON(jsonData) {

}

