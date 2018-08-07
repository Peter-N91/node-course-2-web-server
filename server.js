const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express(); // to call express app


hbs.registerPartials(__dirname + '/views/partials');
app.set('View engine', 'hbs');
//use an express middleware
// app.use(express.static(__dirname + '/public')); //dirname stores the path to our project name directory
// calling the first use (above) will call successfully because it doesn't need a next and it is before all the others that need next

app.use((req, res, next) => {
  // we are gonna add a logger and timestamp
  var now = new Date().toString();
  // console.log(`${now}: ${req.method} ${req.url}`);
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append server.log');
    }
  });
  // if the middleware doesn't call next the handlers will never gonna fire
  next();
});
// calling the middleware above will succeed because next is available as for calling the app in general will fail and show the maintenance
// folder below because no next is used

//
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public')); // putting this here will not be fired untill we remove the maintenance middleware

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
// http requests
// app.get('/',(req, res) => { // request and response
//   // res.send('<h1>Hello Express!</h1>');
//   // how to call a json
//   res.send({
//     name: 'Peter',
//     like: [
//       'Swimming',
//       'Football'
//     ]
//   })
// });

app.get('/',(req, res) => { // request and response
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome you are now visiting our homepage',
    // currentYear: new Date().getFullYear()     remove because we have it with the helper
  })
});


app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page',
    // currentYear: new Date().getFullYear()
  });  // render anything used with our view engine
});

// new page in order to push to github and deploy on heroku as a new feature
app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    projectsMessage: 'This page shows the projects accomplished'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  })
});

// to make the app listenning
app.listen(port, () => {    // set the port by heroku
  console.log(`Server is up on port ${port}`);
}); // now you can run it into the terminal and see the result in the browser on the mentioned port
