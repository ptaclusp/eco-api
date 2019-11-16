

// Import express
let express = require('express')
let routes  = require("./api-routes")
let parser = require('body-parser');
let mongoose = require('mongoose');
let cors     = require('cors');

// Initialize the app
let app = express();


app.use(parser.urlencoded({
   extended: true
}));

app.use(parser.json());

app.use('/api', routes);
app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://localhost/Catalog', { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Launch app to listen to specified port
app.listen(port, function () {
    console.log(`API hub started on port ${port}`);
});