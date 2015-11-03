var master = require('./twitch_master'),
	TIMEOUT = 500,
	length = 0;

master.map_load();

function iter()
{
	var next = Object.keys(master.map)[length];
  
	if (next != null) {
		console.log('Sending: ' + next + ' -> ' + master.map[next]);
		pub.send(['qemu-manager', master.map[next] + '\n']);

		length++;
		setTimeout(iter, TIMEOUT);
	} else {
		console.log('Done!');
	}
}

setTimeout(iter, TIMEOUT);
