/* =======================================
 * ========= global variables ============
 * =======================================
 */

/* exports */
var exports = module.exports = {};
exports.map = {}; // json command mapping

/* requires */
var fs  = require('fs'),
	irc = require('irc'),
	crypto = require('crypto'),
	pub = require('./lib/comm').sender(),
	config = require('./config.json');

/* settings */
var command_interval = 15,
	command_mode = 'demorchy'; // possible values: anarchy, democracy, demorchy

/* utility */
var twitch_chat = new irc.Client('irc.twitch.tv', config['nick'], {
	channels: ['#' + config['nick']],
	userName: config['nick'],
	password: config['password'],
	autoConnect: false
});

/* misc */
var voting_command = null,
	last_command,
	last_tally = {}; // keeps users with their responses



/* =======================================
 * ============= functions ===============
 * =======================================
 */

/* simply returns an integer according to low~high range */
function randomInt (low, high)
{
	return Math.floor(Math.random() * (high - low) + low);
}


/* reports status to the console, client-status and/or twitch chat */
function reportStatus(message, twitch)
{
	pub.send(['client-status', message]);

	if (twitch_chat && config && twitch)
		twitch_chat.say('#' + config['nick'], message);

	console.log(message);
}


/* loads the command mapping - exported for testing */
exports.map_load = function()
{
	fs.exists('map.json', function() {
		try {
			var map_new = require('./map.json');
			exports.map = map_new;
			console.log('(Re)loaded map.json');
		} catch (ex) {
			console.log('Could not load map.json');
			console.log(ex);
		}
	});
}


/* demorchy and democracy modes */
function democracy_related()
{
	var command_count  = {};

	if (command_mode == 'demorchy') {
		/* tampering the total messages array (command_count) before it undergoes analysis */
		var demorchy_pool = Math.round(Object.keys(last_tally).length/3),
		users_voted = [],
		rand_int;

		while (users_voted.length < demorchy_pool) {
			for (var user in last_tally) {
				rand_int = crypto.randomBytes(4).readUInt32BE(0);

				if ((rand_int % 2) == 0 && users_voted.indexOf(user) == -1) {
					if (command_count[last_tally[user]] == null)
						command_count[last_tally[user]] = 0;

					command_count[last_tally[user]] += 1;
					users_voted.push(user);
				}
			}
		}
	} else {
		for (var user in last_tally) {
			if (command_count[last_tally[user]] == null)
				command_count[last_tally[user]] = 0;

			command_count[last_tally[user]] += 1;
		}
	}


	var top_array = [],
		top_count = 0,
		second_array = [],
		second_count = 0;

	for (var command in command_count) {
		if (command_count[command] > top_count) {
			second_array = top_array.slice();
			second_count = top_count;
			top_array = [];
			top_array.push(command);
			top_count = command_count[command];
		} else if (command_count[command] == top_count) {
			top_array.push(command);
		} else if (command_count[command] > second_count) {
			second_array = [];
			second_array.push(command);
			second_count = command_count[command]
		} else if (command_count[command] == second_count) {
			second_array.push(command);
		}
	}

	var counts = '',
		commands = top_array.concat(second_array);

	for (var index in commands) {
		var command = commands[index];

		counts += '\'' + command + '\' = ' +
			Math.round(command_count[command]/Object.keys(last_tally).length * 100, 2) + '%';

		if (index != Object.keys(commands).length - 1)
			counts += ', '
	}

	// clear out tally info for next time
	last_tally = {};

	if (top_array.length > 0) {
		var selected_command = top_array[Math.floor(Math.random()*top_array.length)];

		reportStatus('Winning command: ' + selected_command, true);
		reportStatus('VOTES: ' + counts, true);

		return selected_command;
	}
}


/* anarchy mode! */
function anarchy()
{
	if (last_command) {
		var selected_command = last_command;
		last_command = null;

	// The second parameter in the following reportStatus function determines 
	// If the command will be reported in the chat stream or not

		reportStatus('Winning command: ' + selected_command, true);

		return selected_command;
	}
}


/* recursive command processing backbone */
function processCommand()
{
	command_interval = randomInt(5,8);
	var next_ms = command_interval * 1000;

	if (command_mode == 'anarchy' && !voting_command) {
		// smudges timer by random amounts. last # is smudge factor
		next_ms += Math.round((Math.random() - 0.5) * 2 * next_ms * 0.3);
	}
  
	setTimeout(processCommand, next_ms);
  
	var selected_command;

	if (voting_command != null)
		selected_command = democracy_related();
	else {
		switch (command_mode) {
		case 'democracy':
			selected_command = democracy_related();
			break;
		case 'demorchy':
			selected_command = democracy_related();
			break;
		case 'anarchy':
			selected_command = anarchy();
			break;
		default:
			break;
		}
	}

	if (selected_command) {
		if (voting_command != null) {
			// we are voting to run a dangerous command
			if (selected_command == 'yes') {
				reportStatus('Vote succeeded: ' + voting_command, true);

				// send
				var command_qemu = exports.map[voting_command].replace(/^VOTE /, '');
				console.log('Sending to qemu: ' + command_qemu);
				pub.send(['qemu-master', command_qemu]);
			} else {
				reportStatus('Vote failed: ' + voting_command, true);
			}
      
			voting_command = null;

		} else if (exports.map[selected_command].indexOf("VOTE") == 0) {
			// this command requires a vote
			reportStatus('Voting on command (yes to run, nop not to run): ' + selected_command, true);

			voting_command = selected_command;
			last_tally = {}; // in case we are in anarchy
      
		} else if (exports.map[selected_command] != "") {
			// normal command
			console.log('Sending to qemu: ' + exports.map[selected_command]);
			pub.send(['qemu-master', exports.map[selected_command]]);
		}
	} else {
		//reportStatus('Not enough votes.', true);
	}
}




/* =======================================
 * =============== main ==================
 * =======================================
 */
function main()
{
	process.stdin.resume();
	process.stdin.on('data', function(data) {
		process.stdout.write('Control: ' + data);
		var args = data.toString().split(' ');

		switch(args[0].trim()) {
		case 'map_load':
			exports.map_load();
			break;
		case 'reset_voting':
			// for when this inevitably breaks
			voting_command = null;
			break;

		case 'anarchy':
			command_mode = 'anarchy';
			last_command = null;
			reportStatus('ANARCHY is now in effect!', true);
			break;
		case 'democracy':
			command_mode = 'democracy';
			last_tally = {};
			reportStatus('DEMOCRACY is now in effect!', true);
			break;
		case 'demorchy':
			command_mode = 'demorchy';
			last_tally = {};
			reportStatus('DEMORCHY is now in effect!', true);
			break;

		case 'set_interval':
			var new_interval = +args[1];

			if (new_interval >= 1) {
				command_interval = new_interval;
				reportStatus('VOTING INTERVAL is now ' + new_interval + ' seconds.', false);
			} else {
				console.log('Trouble parsing command interval seconds, try again..');
			}
			break;
      
		default:
			console.log("Sending...", args);
			pub.send(args);
			break;
		}
	});

	exports.map_load();

	twitch_chat.connect(0, function() {
		console.log("Twitch connected!");
	});

	twitch_chat.addListener('message#' + config['nick'], function(from, msg) {
		msg = msg.trim();
  
		if (exports.map[msg] != null) {
			console.log(from + ': ' + msg + ' -> ' + exports.map[msg]);
			pub.send(['client-console', '> ' + from + ': ' + msg]);

			last_tally[from.trim()] = msg;
			last_command = msg;
		}
	});

	// set the first voting timer, initiating the recursion
	setTimeout(processCommand, command_interval * 1000);
}


/* fly ye bstrds */
main();