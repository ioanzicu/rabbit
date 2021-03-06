var express = require("express");
var axios	= require("axios");
var router	= express.Router();
var Rabbit = require("../models/rabbit");
var middleware = require("../middleware");
var moment = require('moment');

// INDEX - show all rabbits
router.get("/", function(req, res){
	// GET all rabbits from DB
	Rabbit.find({}, function(err, allCampgrounds){
		if (err) {
			console.log(err);
		} else {
			res.render("rabbits/index", {campgrounds: allCampgrounds});
		}
	});
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to rabbits array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var address = req.body.address;
	var color = req.body.color;
	var texture = req.body.texture;
	var phone = req.body.phone;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newRabbit = {name: name, price:price, image:image, color:color, texture:texture, address:address, phone:phone, description:desc, author:author}
	// Create a new campground and save to Db
	Rabbit.create(newRabbit, function(err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			// redirect back to rabbits page
			res.redirect("/rabbits");
		}
	});
});

// NEW - show form to create campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("rabbits/new.ejs");
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	// Find the campground with provieded ID
	Rabbit.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err) {
			console.log(err);
		} else {
			var tmp = moment(foundCampground.createdAt);
			var postedAt = tmp.format('llll').substring(0,26);
			// console.log(foundCampground.comments);
			// render show template with that campground
			res.render("rabbits/show", {campground: foundCampground, time: postedAt});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Rabbit.findById(req.params.id, function(err, foundCampground){
		res.render("rabbits/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Rabbit.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if (err) {
			res.redirect("/rabbits");
		} else {
			res.redirect("/rabbits/" + req.params.id);
		}
	});
	// redirect somewhere(show page)
});

// DESTROY CMAPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Rabbit.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/rabbits");
		} else {
			res.redirect("/rabbits");
		}
	});
});

module.exports = router;