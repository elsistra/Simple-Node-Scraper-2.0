const http = require('http');
const https = require('https');

const express = require('express');
const bodyParser = require('body-parser');
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
const io = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);

function executeSearch(url, keyword, user){
  // Ensurefields are not empty
  if (!url || !keyword) {
    console.log('A field was left empty');
  }else{
    console.log('Executing Search');
    https.get('https://www.' + url, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', async () => {
      const db = app.get('db'); // Select the Database
      const searches = db.collection("searches"); // Select searches collection
      const regExp = new RegExp(keyword, "ig");
      const matches = rawData.match(regExp);
      if (matches) {
        console.log('Found ' + matches.length + ' occurrences of string: ' + keyword + ' for user: ' + user);
        const result = await searches.insert({url: url, keyword: keyword, matches: matches.length, user: user, date: new Date()});
      } else {
        console.log('String not found.');
      }
    });
  }).on('error', (err) => {
    console.error(`Got error: ${err.message}`);
  });
  }
}

module.exports = function (app) {

  app.get('/landing', (req, res) => { // Render the register page on request
    res.render('landing', { session: req.session });
  });

  // When the Landing form is posted, this function will run
  app.post('/landing', urlencodedBodyParser, async(req, res) =>{
    let url = req.body.url; // Get POST content from the form
    let keyword = req.body.keyword;
    let user = req.session.username;
    executeSearch(url, keyword, user);
  });
};
