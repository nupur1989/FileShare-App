/**
 * New node file
 */
var mysql      = require('mysql');
//Cryoto -- MD5 Hash Npm
var crypto = require('crypto');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin',
	database : 'users'
});
function createNewConnection(){
	return mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'users'
});
}

var user_exist = 0;

exports.register = function(req, res){
	connection.connect();
	/*console.log("Test re 2:: "+req.data);*/
	var username=JSON.stringify(req.body.username);
	var f_name=JSON.stringify(req.body.f_name);
	var l_name=JSON.stringify(req.body.l_name);
	var email=JSON.stringify(req.body.email);
	var pass=JSON.stringify(req.body.pwd);
	var pwd = crypto.createHash('md5').update(pass).digest('hex');

	//MD5 Algorithm 
	/*var f_name = crypto.createHash('md5').update(firstname).digest('hex');
	var l_name = crypto.createHash('md5').update(lastname).digest('hex');
	var email = crypto.createHash('md5').update(email_id).digest('hex');
	var password = crypto.createHash('md5').update(pass).digest('hex');

	 */


	connection.query("SELECT 1 FROM registration WHERE username = '"+username+"' ORDER BY username LIMIT 1", function (error, results, fields) {
		console.log("Result :: "+results);
		if (results.length  > 0) {
			console.log('user already exists');
			user_exist = results;
			res.render('index', {title: 'Registration Page', message: 'Username already exist. Please choose another username'});
		} else {
			console.log('insert');
			user_exist = 0;
		}
		console.log(results);


		if(user_exist === 0){

			var sql = 'insert into registration (username,f_name,l_name,email,pwd) values (?,?,?,?,?)';		    	
			connection.query(sql, [username,f_name,l_name, email,pwd], function(err, rows, fields) {
				if (!err){
					res.render('index', {title: 'Registration Page', message: 'Successful'});
				}
				else {
					console.log('Error while performing Query.' + err);
					res.render('index', {title: 'Registration Page', message: 'Error while performing Query.'});
				}
			});	

		}
		connection.end();
	});


	exports.auth = function (req, res) {
		connection.connect();

		console.log("auth called");
		var sqlStmt = "select f_name,l_name from registration where username=? and pwd=?";
		var params = [req.param('username'), req.param('pwd')];
		//console.log(req.body.mem_id.toString());
		connection.query(sqlStmt, params, function(err, rows) {
			console.log(rows);
			if(rows.length !== 0) {
				var firstname;
				var lastname;			
				firstname=rows[0].f_name;
				lastname=rows[0].l_name;
				res.render('main',{f_name:firstname,l_name:lastname});
			} 
			else {
				res.render('login', { title: 'Login',errorMessage: "Invalid Login. Try again."});
			}

		});
	}
	connection.end();
	};

	exports.rakhif=function(req,res){
		var connection3= createNewConnection();
		
 	console.log('doing fetch');

	var jsonDataInput = req.body;
	var fileName = jsonDataInput.filename;
	var loggedUserName = jsonDataInput.loggedUserName;
	console.log('Logged User: ' + loggedUserName + ' filename : ' + fileName);
   
	var jsonData;
		jsonData = { post: [] };
	var dbSelectStmt = connection3.query("SELECT filename, fileowner, creationdate, usersSharedWith FROM filedetails where filename = '" + 	fileName + "' AND fileowner = '" + loggedUserName + "'",
			function(err, rows, fields){
			if(err){
			console.log('Error in getting details of file\n');	
			res.status(500).send("Error in getting details of the file" );
			}
			else{
				var row = rows[0];
				jsonData.post.push({ filename: row.filename, fileowner: row.fileowner, creationdate: row.creationdate, usersSharedWith: row.usersSharedWith });
				res.write(JSON.stringify(jsonData));
				console.log(JSON.stringify(jsonData));
				res.end();
			
			}	
	});
	connection3.end();  
}; 
exports.rakhil=function(req,res){
	connection2 = createNewConnection();
 	console.log('doing fetch Link');

	var jsonDataInput = req.body;
	var fileName = jsonDataInput.filename;
	var loggedUserName = jsonDataInput.loggedUserName;
	console.log('Logged User: ' + loggedUserName + ' filename : ' + fileName);

	/*connection = createNewConnection();*/

	"use strict";
	var jsonData;
		jsonData = { post: [] };
	var dbSelectStmt = connection2.query("SELECT fileLink FROM filedetails where filename = '" + 	fileName + "' AND fileowner = '" + loggedUserName + "'",function(err, rows, fields){
			if(err){
			console.log('Error while getting Link of a file ' + fileName + '\n' );	
			res.status(500).send({ message: "Error in getting link of the file" });
			}
			else{
				var row = rows[0];
				jsonData.post.push({ fileLink: row.fileLink});
				res.write(JSON.stringify(jsonData));
				console.log("File Link is: " + JSON.stringify(jsonData));
				res.end();
				//connection.end(); 
			}	
			
	});
	connection2.end();
}; 

exports.rakhiSharedUser=function (request,response){
	
	console.log("Inside share logic");
  connection1=createNewConnection();
	
    var jsonData = request.body;
	var jsonDataOutput;
	jsonDataOutput = { post: [] };	
	
	fileName = jsonData.filename;
	loggedInUser = jsonData.loggedUserName;
	userName = jsonData.username;
	console.log("File Name is: " + fileName);
	console.log("LoggedIn user is: " + loggedInUser);
	console.log("Username with whom you want to share: " + userName);
	
	//check if the user with whom you want to share have an account in this application
	connection1.query('SELECT count(*) AS total from registration where username = "' + userName + '"' , function(err, rows, fields){
		console.log(rows[0]);
		 if(!err && rows[0].total == 1){
			console.log("UserName found in database");	
			connection1.query('SELECT usersSharedWith from filedetails where filename = "' + fileName + '" AND fileowner = "' + loggedInUser + '"', function(err, rows, fields){
							
  			if (!err){
   				var userList= rows[0].usersSharedWith;
    			console.log('The existing userList is: ', userList);
				if(userList == null || userList == ""){
				// if no one is in shared list
				// TODO: Investigate if an entry is required in database for non shared files or not. One way to get details of file is by querying S3
				//Initially (when file is not shared with anyone) "null" will be written in database for each file.
					var query = connection1.query('update filedetails SET usersSharedWith = ";'+ userName +'" where filename = "' + fileName +'" AND fileowner = "' + loggedInUser + '"' , 	function(err, rows,fields) {
									
  						if(err){
							console.log("Error in updating first shared user for the file: " + fileName + " " + err.message);
							response.status(500).send('Error in updating first shared user for the file');
    					}else{
     						console.log('successfully added the first shared user for the file ' + fileName);
							jsonDataOutput.post.push({message:'successfully added the first shared user.'});
					 		response.status(200).send(JSON.stringify(jsonDataOutput));
						}
					});
				}else{
				// already there are some users in the shared list
					pattern1 = ';' + userName + ';' ;
					pattern2 = userName + ';' ;
					pattern3 = ';' + userName;
					
					if(userList.indexOf(pattern1) > -1 || userList.indexOf(pattern2) > -1 || userList.indexOf(pattern3) > -1) {
						console.log('User already exists in shared list of users');
						response.status(500).send("User already exists in shared list of users");
					}else{
						userList1 = userList + pattern3;
						var query = connection1.query('update filedetails SET usersSharedWith = "'+ userList1 +'" where filename = "' + fileName +'" AND fileowner = "' + loggedInUser + '"', function(err, rows,fields) {
										console.log("This is being printed in update file details else method.");
  						if(err){
							console.log("Error while adding a user in the existing shared list of users " + err.message);
							response.status(500).send('Error while adding a user in the existing shared list of users');
    					}else{
     						console.log('successfully added username to existing shared list users');
							jsonDataOutput.post.push({message:'successfully added username to existing shared list users'});
							response.status(200).send(JSON.stringify(jsonDataOutput));	
									
						}
						});
					}
				}
							
			}
  			else{
    			console.log('Error while getting existing list of shared users for file: ' + fileName);
			}
			
	});	

		}else{
			if(err){
				console.log("Error occured while checking if the shared user has account: " + err.message);
				response.status(500).send("Error while checking if the shared user has account");
				connection1.end();
        		response.end();	
			}else{
				console.log("Username " + userName + " don't have account in application");	
				response.status(404).send( "Username " + userName + " don't have account in application" );
				connection1.end();
        		response.end();	
        		
			}	
		}
	});
};

/** This will insert the details of a particular file in the table
req parameter will contain fileowner,filename, creationDate, s3link
*/
exports.rakhiFileInsert=function(req,res){
 	console.log('inserting file details');
 
	var jsonDataInput = req.body;
	var fileName = jsonDataInput.filename;
	var fileowner = jsonDataInput.loggedUserName;
	var creationDate = jsonDataInput.creationDate;
	var s3link = jsonDataInput.s3link;
	var identityString =  fileowner + fileName;
	var shasum = crypto.createHash('sha1');
	shasum.update(identityString);
	var fileLink = shasum.digest('hex')
	console.log('Logged User: ' + fileowner + ' filename : ' + fileName + ' creationDate : ' + creationDate + ' S3 link : ' + s3link + ' Unique URL ' + fileLink );

	connection = createNewConnection();
	
	"use strict";
	var jsonDataOutput;
		jsonDataOutput = { post: [] };	
var dbInsertStmt = connection.query("insert into filedetails (fileowner,filename,creationdate,fileLink,s3link) values('" + fileowner + "','" + fileName + "','" + creationDate + "','" + fileLink + "','" + s3link + "')" , function(err, rows, fields){
	console.log(dbInsertStmt.sql);
			if(err){
			console.log('Error in inserting details of file\n');	
			res.status(500).send("Error in inserting details of the file" );
			}
			else{
				jsonDataOutput.post.push({message:'successfully inserted file details in database'});
				res.status(200).send(JSON.stringify(jsonDataOutput));	
				connection.end(); 
			}	
	});
};
/** This will delete the details of a particular file in the table
req parameter will contain fileowner,filename
*/
exports.rakhiDeletefunction=function(req,res){
 	console.log('deleting file details in table');
 
	var jsonDataInput = req.body;
	var fileName = jsonDataInput.filename;
	var fileowner = jsonDataInput.loggedUserName;
	
	console.log('Logged User: ' + fileowner + ' filename : ' + fileName);

	connection = createNewConnection();
	
	"use strict";
	var jsonDataOutput;
		jsonDataOutput = { post: [] };	
var dbDeleteStmt = connection.query("delete from filedetails where filename = '" + fileName + "' AND fileowner = '" + fileowner + "'" , function(err, rows, fields){
	console.log(dbDeleteStmt.sql);
			if(err){
			console.log('Error in deleting details of file\n');	
			res.status(500).send("Error in deleting details of the file" );
			}
			else{
				jsonDataOutput.post.push({message:'successfully deleted file details in database'});
				res.status(200).send(JSON.stringify(jsonDataOutput));	
				connection.end(); 
			}	
	});
}; 