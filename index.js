var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "p2p_game"
});




var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected DB!");
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/indexold.html');
});

/*app.get('/user/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
});
*/

var Do = {
	signup: function(obj, msg){
		var sql = "INSERT INTO players (user_token, name, game_data) VALUES ?";
		var values = [[obj.id, msg.name, '{"left":372,"top":104}']];
		con.query(sql, [values], function (err, result) {
			if (err) throw err;
			console.log('User '+ msg.name + ' registered')
		});
	}
};


io.on('connection', function(socket){
 	console.log('a user connected');

	/* let user to create a table */
	socket.on('create_table', function(msg){
		Do.signup(this, msg);
		var creator_id = this.id;
		var gameData = {
			'adminMove': 'true',
			'gameTable': [],
			'score': {'admin': 0,'rival': 0}
		};

		con.query("INSERT INTO tables (admin_token, game_data) VALUES (?, ?)", (new Array(creator_id, JSON.stringify(gameData))), function(err, result){
			if (err) throw err;
			console.log("Table created. Creator is " + creator_id);
			io.sockets.in(creator_id).emit('create_table_response', 'what is going on, party people?');
			// io.sockets.socket(creator_id).emit(msg);
		});
	});

	/* let user to join existing table*/
	socket.on('lemme_join', function(msg){
		Do.signup(this, msg);
		var regular_dude = this.id;
		con.query("UPDATE tables SET user_token = ? WHERE id = ?", (new Array(regular_dude, msg.table_id)), function(err, result){
			if (err) throw err;
			var tbid = {table_id:msg.table_id};
			io.sockets.in(regular_dude).emit('game_started', JSON.stringify(tbid));
			io.sockets.in(msg.user_token).emit('game_started', JSON.stringify(tbid));
		});
	});

	/* let give a chance to user to join created tables */
	socket.on('show_me_tables', function(msg){
		var regular_dude = this.id;
		con.query("SELECT tables.id, tables.admin_token, tables.date_time, players.name FROM tables JOIN players ON tables.admin_token = players.user_token ORDER BY 1 DESC", function(err, result){
			if (err) throw err;
			// console.log(result);
			io.sockets.in(regular_dude).emit('dude_take_your_tables', JSON.stringify(result));
		});
		// console.log(msg.data);
		// console.log(this.id);
	});




	/* here should be logint of playing*/
	socket.on('move', function(msg){
		// es arafers ar shveba jer arseti saxis data unda shevinaxo bazashi mere
		//  da eg data unda daaapdeitdes drodadro
		//  tamasis data ra
		//table id is mixedvit ivipovni da mere shvadareba dminia tu mereor
		var msg = JSON.parse(msg),
			player = this.id,
			isAdmin = false,
			queryRes = {};
		console.log(msg);
		console.log(msg.table_id)

		con.query("SELECT * FROM tables WHERE id = ?", [msg.table_id], function(e, res){
			if (e) throw e;

			console.log(typeof res);
			console.log(res);
			console.log(res[0]);
			console.log(res[0]['id']);

			let result = res[0];

			if( player == result['admin_token']){
				isAdmin = true;
				console.log('admin')
				io.sockets.in(queryRes.user_token).emit('update', JSON.stringify(msg));		
			}else{
				console.log('!admin')
				io.sockets.in(queryRes.admin_token).emit('update', JSON.stringify(msg));
			}

			// console.log(result['admin_token']);
			// console.log(typeof result['game_data']);
			var game_data = JSON.parse(result['game_data']);

			//  admin is 1 rival is 2 nad 0 is default
			// console.log(typeof game_data)
			// console.log(game_data)
			
/*			if(isAdmin && game_data.adminMove){
				// admin is making a move
				game_data.adminMove = false;
				if(game_data.gameTable[msg.row][msg.col] == 0){
					game_data.gameTable[msg.row][msg.col] = 1
				}

			}else if(!isAdmin && !game_data.adminMove){
				//  rival is making a move
				game_data.adminMove = true;
				if(game_data.gameTable[msg.row][msg.col] == 0){
					game_data.gameTable[msg.row][msg.col] = 2
				}
			}
*/


			// send this data to both gamers
		/*	io.sockets.in(queryRes.admin_token).emit('update', JSON.stringify(game_data));
			io.sockets.in(queryRes.user_token).emit('update', JSON.stringify(game_data));*/
		});


		/*var data = {
			adminMove: true,
			gameTable: [[0,0,0],
						[0,0,0],
						[0,0,0]],
			score: {
				admin: 0,
				rival: 0
			}
		}*/
	});



  /* on exchange main game data  */
  	socket.on('my_data', function(msg){
	  	var msgJson = JSON.parse(msg);
	  	console.log(msg);
	  	// console.log(msgJson);
	  	var sql = "UPDATE players SET name = ?, game_data = ? WHERE user_token = ?";
		var values = [msgJson.name, msg, this.id];
		con.query(sql, values, function (err, result) {
			if (err) throw err;
			if(result.affectedRows != 1){
				console.log("record updated");
			}
		});
		
    });

	socket.on('disconnect', function(){
		console.log('user disconnected');
		var sql = "DELETE FROM players WHERE user_token = ?";
		var value = [[this.id]];
		con.query(sql, [value], function (err, result) {
			if (err) throw err;
			console.log("player data deleted");
		});
		/*delete table*/
		con.query("DELETE FROM tables WHERE admin_token = ?", (new Array(this.id)), function (err, result) {
			if (err) throw err;
			console.log("player table deleted");
		});
	});
});

    
http.listen(3000, function(){
  console.log('listening on *:3000');
});



 
