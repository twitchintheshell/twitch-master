var QMP = require('qemu-qmp'),
	qmp = new QMP();

qmp.connect('/tmp/qmp-sock', function(err) {
	if (err) throw err;

	qmp.execute('query-commands', function(err, commands) {
		if (err) throw err;
  
		console.log(commands);
	});
});
