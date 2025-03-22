const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 5555;
const MONGOURI = process.env.MONGOURI;

mongoose
    .connect(MONGOURI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Error connecting to MongoDB...', err));

app.use(express.json());




// Prevent Server from Starting in Test Environment
if (require.main === module) {
    global.__SERVER__ = app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

module.exports = app;
