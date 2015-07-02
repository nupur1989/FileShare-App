/**
 * New node file
 *//*
var mysql      = require('mysql');
//Cryoto -- MD5 Hash Npm
var crypto = require('crypto');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin',
	database : 'users'
});
connection.connect();
var user_exist = 0;

exports.auth = function (req, res) {
	
	 console.log("auth called");
	
	//connection.escape(userId) to avoid SQL Injection attacks
	var sqlStmt = "select f_name,l_name from registration where username=? and pwd=?";
	
	var params = [req.param('username'), req.param('pwd')];
	//console.log(req.body.mem_id.toString());
	query.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows);
		if(rows.length !== 0) {
			var firstname;
			var lastname;
			
			req.session.username = req.param('username');
			sqlStmt='select f_name,l_name from registration where username=? and pwd=?';
			console.log("Reached here above sql query" +req.param('username'));
					query.execQuery(sqlStmt,[req.param('username'), req.param('pwd')],function(err,rows){
						console.log(rows);
						firstname=rows[0].first_name;
						lastname=rows[0].last_name;
						
						res.render('main.ejs',{firstname:firstname,lastname:lastname});
			});
				
				
				
			} else {
				res.render('login', { title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
			}
		
	});
};*/