var logger = require('log4js').getLogger('APP_LOG');
var nconf = require('nconf');
var verifiyMessage = require(__dirname + '/../lib/verifier').verifiyMessage;
var telegram = require(__dirname + '/../lib/telegram');

var config = {
    receivers: nconf.get('receivers'),
    senders: nconf.get('senders'),
    bots: nconf.get('bots')
};

var healthCheck = function(req, res) {

    res.status(200).send('OK');
}

function sendMessage(req, res) {

    var receiver = req.body.receiver;
    var message = req.body.message;
    var botname = req.body.botname;
    var sender = req.body.sender;
    var password = req.body.password;

    var vaildResult = verifiyMessage(config, receiver, message, botname, sender, password);

    switch (vaildResult) {

        case 'Error: Missing message':
            res.setHeader('Content-Type', 'application/json');
        res.status(400).send(JSON.stringify({
            error_code: 400,
            description: vaildResult
        }));
        break;

        case 'Message verified':
            logger.info('Sending Message....');
        logger.info('Message:')
        logger.info({
            sender: sender,
            receiver: receiver,
            botname: botname,
            message: message
        })

        telegram.sendMessage(config, sender, receiver, message, botname, function(err, message) {

            if (err) {
                logger.error(err);
                res.setHeader('Content-Type', 'application/json');
                res.status(403).send(JSON.stringify(err));
                return;
            }

            logger.info(message);

            res.setHeader('Content-Type', 'application/json');
            res.status(201).send(JSON.stringify(message));
        });
        break;

        default:
            res.setHeader('Content-Type', 'application/json');
        res.status(401).send(JSON.stringify({
            error_code: 401,
            description: vaildResult
        }));
    }
}

module.exports = {
    'healthCheck': healthCheck,
    'sendMessage': sendMessage
};
