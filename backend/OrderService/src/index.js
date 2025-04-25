require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5559;
const MONGOURI = process.env.MONGOURI;

mongoose
    .connect(MONGOURI)
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;
