var	tableId = 0,
	names = new Array('Ioseb', 'Stalini', 'Nimda', 'Aleko', 'Nika', 'Nuca', 'Kitovani'),
	blocks  = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1),
	isAdmin = false,
	myTurn  = false,
	gameStarted = false,
	PlayerName = names[rand(0, names.length-1)]



var socket = require('socket.io-client')('http://localhost');
socket.on('connect', function(){
	// console.log(`I am ${PlayerName}-bot and I'm online`);
	socket.emit('create_table', {'name':PlayerName});
});

socket.on('event', function(data){});
socket.on('disconnect', function(){});

socket.on('create_table_response', function(msg){
	// console.log('A table has been created');
});

socket.on('game_started', function(msg){
	var msg = JSON.parse(msg);
	tableId = msg.table_id;

	gameStarted = true;
	// console.log('A games has benn started')
	send(rand(0,8), blocks, 'games started')
});

socket.on('update', function(smsg){
	myTurn = true;
	let msg = JSON.parse(smsg);
	blocks[parseInt(msg.value)] = 0;
	send(rand(0,8), blocks, 'update')
});

socket.on('drawn', function(){
	blocks = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1);
	// console.log('arrrs', blocks)
	if(myTurn){
		send(rand(0,8), blocks, 'drawn')
	}
});

socket.on('win', function(){
	blocks = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1);
	// console.log('arrrs', blocks)
	if(myTurn){
		send(rand(0,8), blocks, 'win')
	}
});

socket.on('lose', function(){
	blocks = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1);
	// console.log('arrrs', blocks)
	if(myTurn){
		send(rand(0,8), blocks, 'lose')
	}
});


socket.on('offline', function(){
	gameStarted = false;
	socket.emit('create_table', {'name':PlayerName});
});
// setInterval(function(){
	// console.log(myTurn,(rnd = blocks[rand(0,8)] == -1), gameStarted)
// 	if(myTurn && (rnd = blocks[rand(0,8)] == -1) && gameStarted){
// 		// send(rnd)
		// console.log(rnd)
// 	}
// 	// }
// }, 1000);


function send(id, blocks, n=''){
	if(blocks.indexOf(-1) == -1){
		// console.log('no -1 there ', n)
		return;
	}
	while(blocks[id] != -1){
		id = rand(0,8)
		// console.log(`gen ${id}`, blocks)
	}
	blocks[id] = 1;
		myTurn = false;
		var obj = {
			'value': id,
			'table_id': tableId,
			'myName': PlayerName
	    };
		socket.emit('move', JSON.stringify(obj));
	// console.log(`${id} sent`);
	
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min); 
}