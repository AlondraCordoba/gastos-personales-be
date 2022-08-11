const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const mongoose = require('mongoose');
const mongoClient = require('mongodb').MongoClient;
const config = require('./config/config');
const auth = require('./routes/auth');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/app', routes);
app.get("/auth", auth, (req, res) => {
    res.json({ message: "You are authorized to access me" });
});

mongoose.connect(config.NODE_SERVER).then((data) => {
    console.log("Connected to Database");
}).catch((error) => {
    console.log(error);
});

app.listen(process.env.PORT || 5000);