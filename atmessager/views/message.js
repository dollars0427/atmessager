var logger = require('log4js').getLogger('APP_LOG');
var nconf = require('nconf');
nconf.file('bots', __dirname + '/../config/bots.json')
	.file('receviers', __dirname + '/../config/receivers.json')
	.file('senders', __dirname + '/../config/senders.json');

var verifiyMessage = require(__dirname + '/../lib/verifier').verifiyMessage;
var telegram = require(__dirname + '/../lib/telegram');

var healthCheck = function(req, res) {

	res.status(200).send('OK');
}

function sendMessage(req, res) {

	var receiver = req.body.receiver;
	var message = req.body.message;
	var botname = req.body.botname;
	var sender = req.body.sender;
	var password = req.body.password;

	var vaildResult = verifiyMessage(nconf, receiver, message, botname, sender, password);

	switch (vaildResult) {

		//Bad Request: Wrong receiver name

		case 'Bad Request: Wrong receiver name':
			res.status(400).send(vaildResult);
			break;

			//Bad Request: Wrong bot name

		case 'Bad Request: Wrong bot name':
			res.status(400).send(vaildResult);
			break;

			//Bad Request: Sender not found

		case 'Bad Request: Sender not found':
			res.status(400).send(vaildResult);
			break;

			//Bad Request: Password not match

		case 'Bad Request: Password not match':
			res.status(400).send(vaildResult);
			break;

			//Bad Request: Missing message

		case 'Bad Request: Missing message':
			res.status(400).send(vaildResult);
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

			telegram.sendMessage(nconf, receiver, message, botname, function(err, message) {

				if (err) {
					logger.error(err);
					res.status(403).send(JSON.stringify(err));
					return;
				}

				logger.info(message);

				res.status(201).send(JSON.stringify(message));
			});
			break;

		default:
			res.statusCode(204);
	}
}

module.exports = {
	'healthCheck': healthCheck,
	'sendMessage': sendMessage
};
