var sub = require('./lib/comm').receiver('qemu-manager');
console.log('Connecting to master...');
sub.monitor();

var child = null,
	spawn = require('child_process').spawn;

function spawn_process(child_process) {
	child_process = spawn('bash', ['lib/launch.sh']);

	child_process.stdout.on('data', function(data) {
		console.log('QEMU: ' + data);
	});

	child_process.stderr.on('data', function(data) {
		console.log('ERR QEMU: ' + data);
	});

	child_process.on('exit', function(data) {
		console.log('EXIT QEMU: ' + data);
		spawn_process(child);
	});

	child = child_process;
}


spawn_process(child);

sub.on('connect', function() {
	console.log('Connected to master.');
});

sub.on('disconnect', function() {
	console.log('Disconnected from master.');
});

sub.on('message', function() {
	var msg = arguments[1].toString();

	process.stdout.write('> ' + msg);
	child.stdin.write(msg);
});


process.stdin.resume();
process.stdin.on('data', function(data) {
	child.stdin.write(data.toString());
});