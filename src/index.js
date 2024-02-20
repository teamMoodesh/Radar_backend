const dotenv = require('dotenv');
const connectDB = require('./database/index.js');
const { app } = require('./app.js');

dotenv.config({
  path: "/env",
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at Port:${process.env.PORT}`);
        });
    })
    .catch((e) => {
        console.log("Database connection failed", e);
    });