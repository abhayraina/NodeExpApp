var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*var logger = (req, res, next) => {
	console.log("Logging...");
	next();
}

app.use(logger); */

// View Engine

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MiddleWare fo Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static path
app.use(express.static(path.join(__dirname, "public")));

//Global Variable
app.use((req, res, next) => {
	res.locals.errors = null;
	next();
});

// Express Validator
app.use(expressValidator());



app.get('/', (req, res) => {

	db.users.find((err, docs) => {
		console.log(docs);
		res.render("index", {
			title: "Customers",
			users: docs
		});
	});
});

app.post("/users/add", (req, res) => {

	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render("index", {
			title: "Customers",
			users: users,
		});
	}
	else {
		var newUser = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email
		}

		db.users.insert(newUser, (err, result) => {
			if (err) {
				console.log(err);
			}
			res.redirect('/');
		});
		console.log("Added");
	}
});

app.delete('/users/delete/:id', function (req, res) {
	db.users.remove({ _id: ObjectId(req.params.id) }, function (err, result) {
		if (err) {
			//	console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, () => {
	console.log("Server started on port: 3000");
});

