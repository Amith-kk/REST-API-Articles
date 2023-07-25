const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res) {
    Article.find()
    .then((foundArticles) => {
        res.send(foundArticles);
    })
    .catch((err) => {
        Console.error(err);
    })
});

app.post("/articles", function(req, res) {
    console.log();
    console.log();

    const newArticles = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticles.save()
    .then(() => {
        res.send("successfully added a new articles.");
    })
    .catch((err) => {
        res.send(err);
    });

});

app.delete("/articles", function(req, res) {
    Article.deleteMany()
    .then(() => {
        res.send("Successfully deleted all articles");
    })
    .catch((err) => {
        res.send(err);
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

