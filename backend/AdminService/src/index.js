require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');  

const app = express();
const PORT = process.env.PORT || 5551 ;
const MONGOURI = process.env.MONGOURI;

// Use cors middleware
app.use(cors());
app.use(express.json());

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

const restaurantProxyRoutes = require('./routes/restaurantProxyRoutes');
app.use('/api/admin', restaurantProxyRoutes);

 

module.exports = app;
