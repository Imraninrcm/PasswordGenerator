const express = require("express");
const generator = require("generate-password");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Server port
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

app.post("/password", (req, res) => {
  let {
    length,
    numbers,
    symbols,
    lowercase,
    uppercase,
    excludeSimilarCharacters,
    exclude,
    strict,
  } = req.body;

  let password = generator.generate({
    length: parseInt(length) || 10,
    numbers: numbers === "on",
    symbols: symbols === "on",
    lowercase: lowercase === "on",
    uppercase: uppercase === "on",
    excludeSimilarCharacters: excludeSimilarCharacters === "on",
    exclude: exclude || "",
    strict: strict === "on",
  });

  res.render("password.ejs", { password });
});
