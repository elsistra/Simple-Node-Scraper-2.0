const http = require('http');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
const io = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);

module.exports = function (app) {
  const db = app.get('db');
  const users = db.collection("users");

  // Render the register page on request
  app.get('/landing', (req, res) => {
    // Send along Session Data
    res.render('landing', { session: req.session });
  });

  // When the Landing form is posted, this function will run
  app.post('/landing', urlencodedBodyParser, async(req, res) =>{
    // Get the POST content from the form
    let url = req.body.url;
    let keyword = req.body.keyword;

    // Ensure no fields are empty
    if (!url || !keyword) {
      console.log('A field was left empty');
      console.log('Keyword: ' + keyword);
      console.log('Url: ' + url);
    }else{
      console.log('Executing Search');

      https.get('https://www.' + url, (res) => {
      res.setEncoding('utf8');
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
      	const regExp = new RegExp(keyword, "ig");
      	const matches = rawData.match(regExp);

      	if (matches) {
      	  console.log('Found ' + matches.length + ' occurrences of string: ' + keyword);
      	} else {
      	  console.log('String not found.');
      	}
      });

    }).on('error', (err) => {
      console.error(`Got error: ${err.message}`);
    });
    }
  });
};
