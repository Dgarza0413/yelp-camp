var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    PORT = process.env.PORT || 5000,
    url = "http://localhost:5000/"

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/yelp_camp";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// var mongoClient = require("mongodb").MongoClient;
// mongoClient.connect("mongodb://7e921b38-0ee0-4-231-b9ee:shPc4Cg5rdrFbLQVLKDc7WVNiTKa2K9X8Ms50Ni03hSIDjdvWQQ38p7YCCfYd5sW3PKa4FYLc1VN1KcL5LZSLw%3D%3D@7e921b38-0ee0-4-231-b9ee.documents.azure.com:10255/?ssl=true", { useNewUrlParser: true }, function (err, client) {
//     client.close();
// });


// var url = "mongodb+srv://dgarza:Utsawebdev2019!@dbcluster-29s92.mongodb.net/test?retryWrites=true"
// mongoose.connect(url)
//     .then(() => console.log("DB connected"))

//     .catch(err => console.error(err));


// console.log(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

// Passport Configuration
app.use(require("express-session")({
    secret: "Rusty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(PORT, function () {
    console.log(`Yelp camp server has started on!! on ${url}`)
});