const express = require("express");
const generator = require("generate-password");
const app = express();
const path = require("path");
const expressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");
const asyncWrap = require("./utils/wrapAsync");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
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
  let pw = req.body.pw;
  asyncWrap(async (req, res) => {
    let pw = req.body.pw;
    if (
      pw.numbers === "no" &&
      pw.symbols === "no" &&
      pw.lowercase === "no" &&
      pw.uppercase === "no" &&
      pw.excludeSimilarCharacters === "no"
    ) {
      throw new expressError(404, "Error occured! please try again");
    }
  });
  let password = generator.generate({
    length: Number(pw.length),
    numbers: pw.numbers === "yes",
    symbols: pw.symbols === "yes",
    lowercase: pw.lowercase === "yes",
    uppercase: pw.uppercase === "yes",
    excludeSimilarCharacters: pw.excludeSimilarCharacters === "yes",
    exclude: pw.exclude,
    strict: pw.strict === "yes", // apply updated strict value
  });

  res.render("password.ejs", { password });
});

app.all("*", (req, res, next) => {
  console.log("Catch-all triggered for:", req.path);
  next(new expressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});
