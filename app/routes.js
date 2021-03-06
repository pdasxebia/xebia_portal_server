// app/routes.js
module.exports = function (app, passport) {
	var resp = require("../config/response.json");
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function (req, res) {
		res.send('hurray!! you are an idiot'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function (req, res) {
		res.status(400);
		// render the page and pass in any flash data if it exists
		res.send(resp.userCredentialsWrong);
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successFlash: 'loggedIn', // redirect to the secure profile section
		failureRedirect: 'login failed', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}),
		function (req, res) {
			//console.log(req.user);
			//console.log(res);
			if (req.body.remember) {
				req.session.cookie.maxAge = 1000 * 60 * 3;
			} else {
				req.session.cookie.expires = false;
			}

			resp.login.authToken = req.sessionID;
			res.send(resp.login);
		});


	app.get('/profile', isLoggedIn, function (req, res) {
		res.send(req.session.user);
	});



	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
