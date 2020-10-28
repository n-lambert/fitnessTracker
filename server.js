const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
const { URI } = process.env;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log("Mongoose is connected!");
})


const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", (req, res) => {
  db.Workout.create({ day: new Date() })
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(({message}) => {
    console.log(message);
  });
});

app.put("/api/workouts/:id", (req, res) => {
  const newObjId = mongoose.Types.ObjectId(req.params.id);
  db.Exercise.create(req.body).then(exerciseData => {
    db.Workout.updateOne({_id:newObjId}, {$push: {exercises: exerciseData._id}}).then(data=>{
      res.json(data);
    }).catch(err => {
      console.log(err);
      res.json(err);
    });
  })
  })

  app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
    .populate("exercises")
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
  })



app.get("/", (req, res) => {
  res.send(200);
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
})

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
})


mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});