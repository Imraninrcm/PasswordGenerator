const express = require("express");
const generator = require("generate-password");
const app = express();
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Home route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

// Password generation route with proper error handling
app.post(
  "/password",
  wrapAsync(async (req, res) => {
    const pw = req.body.pw;

    // Check if all options are "no"
    if (
      pw.numbers === "no" &&
      pw.symbols === "no" &&
      pw.lowercase === "no" &&
      pw.uppercase === "no"
    ) {
      throw new ExpressError(400, "Please select at least one character type.");
    }

    // Generate password
    const password = generator.generate({
      length: Number(pw.length),
      numbers: pw.numbers === "yes",
      symbols: pw.symbols === "yes",
      lowercase: pw.lowercase === "yes",
      uppercase: pw.uppercase === "yes",
      excludeSimilarCharacters: pw.excludeSimilarCharacters === "yes",
      exclude: pw.exclude,
      strict: pw.strict === "yes",
    });

    res.render("password.ejs", { password });
  })
);

// Catch-all route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});

// Server port
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
