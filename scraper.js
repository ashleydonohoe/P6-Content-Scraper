'use strict';
const cheerio = require('cheerio');
const request = require('request');
const json2csv = require('json2csv');
const fs = require('fs');
const rootURL = "http://www.shirts4mike.com/shirts.php";
const baseURL = "http://www.shirts4mike.com/";

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
    request(rootURL, function (error, response, body) {
        if(error) {
            // Shows error that occurred
            console.log(`Could not connect to ${rootURL} to get the data due to error: ${error}`);
        } else {
            let shirtLinks = [];
            let $ = cheerio.load(body);
            // Push each link to the array so it can be used in next request
            $(".products li a").each(function(index) {
                const link = $(this).attr('href');
                links.push(baseURL + link);
            });
            // Show links array
            getShirtInfo(links);
        }
    });
}

function getShirtInfo(links) {
    let jsonData = [];
    for(let i = 0; i < links.length; i++) {
        const link = links[i];
        // Date formatting tip taken from http://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd
        const date = new Date().toISOString().split('T')[0];
        // Make request for each link
        request(link, function (error, response, body) {
            if(error) {
                // Shows error that occurred
                console.log(`Could not connect to ${link} to get the data due to error: ${error}`);
            } else {
                let $ = cheerio.load(body);
                const price = $(".price").text().trim();
                // Used method to exclude span tag from http://stackoverflow.com/questions/11347779/jquery-exclude-children-from-text
                const title = $(".shirt-details h1").clone().find('span').remove().end().text();
                const imageURL = baseURL + $(".shirt-picture img").attr("src");

                // Make JSON object with properties
                const newShirt = {
                    "Title": title,
                    "Price": price,
                    "ImageURL": imageURL,
                    "URL": link,
                    "Time": date
                };

                // Push JSON object to jsonData array
                jsonData.push(newShirt);
            }
            // Send request to make the CSV file
            makeCSVFromJSON(jsonData);
        });
    }
}

function makeCSVFromJSON(jsonData) {
    try {
        var result = json2csv({ data: jsonData});
        const date = new Date().toISOString().split('T')[0];
        const filePath = "data/" + date + ".csv";
        fs.writeFileSync(filePath, result);
    } catch (err) {
        console.log("Could not convert JSON to CSV");
    }
}
