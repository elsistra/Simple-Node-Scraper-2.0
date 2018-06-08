const http = require('http');
const https = require('https');

const bodyParser = require('body-parser');
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });

function executeSearch(app, url, keyword, user){
  return new Promise((resolve, reject) => {
    // Ensure fields are not empty
    if (!url || !keyword) {
      reject(new Error('A field was left empty'));
    }else{
      console.log('Executing Search');
      https.get('https://' + url, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', async () => {
          const db = app.get('db'); // Get the database service
          const searches = db.collection("searches"); // Select searches collection
          const regExp = new RegExp(keyword, "ig");
          const matches = rawData.match(regExp);
          if (matches) {
            console.log('Found ' + matches.length + ' occurrences of string: ' + keyword + ' for user: ' + user);
            const result = await searches.insert({url: url, keyword: keyword, matches: matches.length, user: user, date: new Date()});
          } else {
            console.log('String not found.');
          }
          resolve();
        });
      }).on('error', (err) => {
        console.error(`Got error: ${err.message}`);
        reject(err);
      });
    }
  });
}

function waitFor(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
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

    for (let i = 0; i < 100000; i++) { // Loop 10 times
      if (i !== 0) { // Unless on first iteration
        await waitFor(10); // Wait 1 minute before proceeding
      }

      await executeSearch(app, url, keyword, user);
    }
  });
};
