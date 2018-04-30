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
  res.sendFile(__dirname + '/io.client.html');
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
			'gameTable': [-1,-1,-1,-1,-1,-1,-1,-1,-1],
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

		// check whether table is in waiting condition and not busy
		con.query("SELECT * FROM tables WHERE id = ?", [msg.table_id], function(e,r){
			if (e) throw e;
			var result = r[0];
			console.log(result)
			if(result['user_token'] === null){
				console.log('Second player joined')
				con.query("UPDATE tables SET user_token = ? WHERE id = ?", (new Array(regular_dude, msg.table_id)), function(err, result){
					if (err) throw err;
					var j_player = {table_id:msg.table_id, player_name: msg.rival};
					var s_player = {table_id:msg.table_id, player_name: msg.name};
					io.sockets.in(regular_dude)
						.emit('game_started', JSON.stringify(j_player));
					io.sockets.in(msg.user_token)
						.emit('game_started', JSON.stringify(s_player));
				});

			}else{
				console.log('table is full')
				console.log(regular_dude)
				// io.sockets.in(regular_dude).emit
				// io.sockets.in[regular_dude].emit('table_is_full', '');
				io.sockets.in(regular_dude)
						.emit('table_is_full', JSON.stringify({'full':true}));
			}
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



	socket.on('hover', function(msg){

		var msg = JSON.parse(msg),
			player = this.id;
		con.query("SELECT * FROM tables WHERE id = ?", [msg.table_id], function(e, res){
			if (e) throw e;
			let result = res[0];
			if(undefined !== res[0]){
				if( player == result['admin_token']){
					// player isa dmin
					io.sockets.in(result.user_token).emit('hover', JSON.stringify(msg));		
				}else{
					io.sockets.in(result.admin_token).emit('hover', JSON.stringify(msg));
				}
			}else{
				// table creator is offline
				io.sockets.in(player).emit('offline', JSON.stringify({'player':'has gone'}));
			}
		});
	});


/* admin is 0 rival is 1*/
	/* here should be logint of playing*/
	socket.on('move', function(msg){

		var msg = JSON.parse(msg),
			player = this.id,
			isAdmin = false,
			queryRes = null;
		console.log(msg);

		con.query("SELECT * FROM tables WHERE id = ?", [msg.table_id], function(e, res){
			if (e) throw e;

			let result = res[0];
			if( player == result['admin_token']){
				isAdmin = true;
				console.log('admin')
				io.sockets.in(result.user_token).emit('update', JSON.stringify(msg));		
			}else{
				console.log('!admin')
				io.sockets.in(result.admin_token).emit('update', JSON.stringify(msg));
			}



			console.log(result);
			// console.log(result['admin_token']);
			// console.log(typeof result['game_data']);
			var game_data = JSON.parse(result['game_data']);
			// let gmDt = JSON.parse(result.gameTable);

			if(isAdmin){
				game_data.gameTable[msg.value] = 0;
			}else{
				game_data.gameTable[msg.value] = 1;
			}

			var data = {
				adminMove: isAdmin,
				gameTable: game_data.gameTable,
				score: {
					admin: parseInt(game_data.score.admin),
					rival: parseInt(game_data.score.rival)
				}
			};

			let score = {
					admin: parseInt(game_data.score.admin),
					rival: parseInt(game_data.score.rival)
			};
			if(Combination.check(game_data.gameTable, 0)){
				// admin wins
				io.sockets.in(result.admin_token).emit('win', JSON.stringify(msg));
				io.sockets.in(result.user_token).emit('lose', JSON.stringify(msg));
				data.score.admin+=1;
				score.admin = data.score.admin;
				// io.sockets.in(result.admin_token).emit('reset');
				//game reset
				data.gameTable = [-1,-1,-1,-1,-1,-1,-1,-1,-1];

			}else if(Combination.check(game_data.gameTable, 1)){
				// rival wins
				io.sockets.in(result.admin_token).emit('lose', JSON.stringify(msg));
				io.sockets.in(result.user_token).emit('win', JSON.stringify(msg));
				data.score.rival+=1;
				score.rival = data.score.rival;
				// io.sockets.in(result.user_token).emit('reset');
				//game reset
				data.gameTable = [-1,-1,-1,-1,-1,-1,-1,-1,-1];


			}else if(Combination.drawn(game_data.gameTable, -1)){
				io.sockets.in(result.admin_token).emit('drawn', JSON.stringify(msg));
				io.sockets.in(result.user_token).emit('drawn', JSON.stringify(msg));
				data.gameTable = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
			}
			console.log(data.gameTable);
			// update score
			io.sockets.in(result.admin_token).emit('score', JSON.stringify(score));
			io.sockets.in(result.user_token).emit('score', JSON.stringify(score));		

			con.query("UPDATE tables SET game_data = ? WHERE id = ?", (new Array(JSON.stringify(data), msg.table_id)), function(err, result){
				if (err) throw err;
			});
			
		});

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
		var value = this.id;
		con.query(sql, [value], function (err, result) {
			if (err) throw err;
			console.log("player data deleted");
		});

		//get admin id
		con.query("SELECT * FROM tables WHERE user_token = ?", [value], function (err, result) {
			if (err) throw err;
			var res = result[0];
			if( undefined !== res){
				io.sockets.in(res.admin_token).emit('offline', JSON.stringify({'thats':true}));
				console.log('player: hey admin I am offline')
				/*delete table*/
				con.query("DELETE FROM tables WHERE id = ?", [res.id], function (err, result) {
					if (err) throw err;
					console.log("player table deleted #", res.id);
				});
			}
		});
	});
});

    
http.listen(3000, function(){
  console.log('listening on *:3000');
});




/*
    winning map
  */
  let Combination = {
    check: function(rects, value){
      let lines = new Array(
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,4,8],
          [2,4,6],
          [0,3,6],
          [1,4,7],
          [2,5,8]
        );

      for(let line of lines){
        let counter = 0;
        for(let index of line){
          if(rects[index] == value){
            counter ++
          }else{
            break
          }
        }
        if(counter === 3){
          return true
        }
      }

      return false
    },
    drawn:function(rects, value){
    	let counter = 0;
    	rects.forEach(function(e){
    		if(e != value){
    			counter ++;
    		}
    	});
    	if(counter == 9){
    		//blocks are full
    		return true;
    	}
    	return false;
    }
  }
