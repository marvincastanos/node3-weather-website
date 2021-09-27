const path = require("path");
const express = require("express");
const hbs = require("hbs");
const { Agent } = require("http");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Public Directory Path
const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// index.hbs
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Marvin",
  });
});

// about.hbs
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Marvin",
  });
});

// help.hbs
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    helpText: "This is some helpful text.",
    name: "Marvin",
  });
});

// weather route
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

// match specific page
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Marvin",
    errorMessage: "Help article not found.",
  });
});

// match generic page
// * means match anything
// * wildcard character
app.get("*", (req, res) => {
  res.render("404", {
    title: "Marvin",
    errorMessage: "Page not found",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// run on the machine only
// app.listen(3000, () => {
//   console.log("Server is up on port 3000.");
// });
