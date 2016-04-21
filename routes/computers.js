var express = require('express');
var router = express.Router();

var Client = require('ssh2').Client;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/:ip', function(req, res, next) {

    var conn = new Client();
    conn
        .on('keyboard-interactive',
            function(name, instructions, instructionsLang, prompts, finish) {
                // Pass answers to `prompts` to `finish()`. Typically `prompts.length === 1`
                // with `prompts[0] === "Password: "`
                finish(['test']);
            })
        .on('ready', function() {
            console.log('Client :: ready');
            conn.exec('uptime', function(err, stream) {
                if (err) throw err;
                stream.on('close', function(code, signal) {
                    console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                }).on('data', function(data) {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', function(data) {
                    console.log('STDERR: ' + data);
                });
            });
        })
        .connect({
            host: 'localhost',
            port: 22,
            username: 'test',
            tryKeyboard: true
        });

    console.log(req);

    res.send('respond with a ip');
});

module.exports = router;
