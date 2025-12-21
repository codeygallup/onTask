const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/ontaskDB");

module.exports = mongoose.connection;
