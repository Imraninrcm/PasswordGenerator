const express = require("express");
const generator = require("generate-password");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

function booleanConvert(trueOrFalse) {
  if (trueOrFalse === "true") {
    return true;
  } else {
    return false;
  }
}

// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Password generation route with proper error handling
app.post("/password", async (req, res) => {
  const { pw } = req.body;

  //Generate password
  const password = generator.generate({
    length: Number(pw.length),
    numbers: booleanConvert(pw.numbers),
    symbols: booleanConvert(pw.symbols),
    lowercase: booleanConvert(pw.lowercase),
    uppercase: booleanConvert(pw.uppercase),
    excludeSimilarCharacters: booleanConvert(pw.excludeSimilarCharacters),
    exclude: pw.exclude,
    strict: booleanConvert(pw.strict),
  });

  res.render("password.ejs", { password });
});

// Server port
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
