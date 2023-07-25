const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { get } = require("http");
const { error } = require("console");

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

////////////////Request Targetting All Articles/////

app.route("/articles")
.get(function(req, res) {
    Article.find()
    .then((foundArticles) => {
        res.send(foundArticles);
    })
    .catch((err) => {
        Console.error(err);
    })
})

.post(function(req, res) {

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

})

.delete(function(req, res) {
    Article.deleteMany()
    .then(() => {
        res.send("Successfully deleted all articles");
    })
    .catch((err) => {
        res.send(err);
    });
});


//////////////////Request Targetting A Specific Articles/////

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle })
      .then((foundArticle) => {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles matching that title was found.");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  })

  .put(function(req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { new: true } // To return the updated document in the response
    )
    .then((updatedArticle) => {
      if (updatedArticle) {
        res.send(updatedArticle);
      } else {
        res.send("No article matching that title was found.");
      }
    })
    .catch((err) => {
      res.send(err);
    });
  })

  .patch(function(req, res) {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { $set: req.body},
        { new: true } // To return the updated document in the response
      )
      .then((updatedArticle) => {
        if (updatedArticle) {
          res.send(updatedArticle);
        } else {
          res.send("No article matching that title was found.");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  })


  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle })
      .then(() => {
        res.send("Successfully deleted the corresponding article.");
      })
      .catch((err) => {
        res.send(err);
      });
  });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});

