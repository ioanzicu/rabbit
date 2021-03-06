require('./config/config');

var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	{mongoose}	= require('./db/mongoose');
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Rabbit 	= require("./models/rabbit"),
	Comment     = require("./models/comment"),
	User		= require("./models/user")
 	// seedDB 		= require("./seeds")

// requring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/rabbits"),
	indexRoutes			= require("./routes/index")

const port = process.env.PORT;
app.use(bodyParser.urlencoded({extended:true}));
// remove "ejs" in url bar
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/css")); 
app.use(express.static(__dirname + "/public/js"));
app.use(express.static(__dirname + "/public/images"));
app.use(methodOverride("_method")); 
app.use(flash());
// seedDB(); // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Barni wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local helper 
app.locals.currentYear = () => new Date().getFullYear();

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/rabbits", campgroundRoutes);
app.use("/rabbits/:id/comments", commentRoutes);

// server listening
app.listen(port, () => {
	console.log(`The Rabbit Server has Started Up at port ${port}!`);
});