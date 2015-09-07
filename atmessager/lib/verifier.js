var logger = require('log4js').getLogger('APP_LOG');

function verifiyMessage(config, receiver, message, botname, sender, password) {

	//If miss message, return error message

	if (message === undefined || message === null) {

		return 'Bad Request: Missing message';
	}

	//If receiver not found, return error message

	if (config.receivers[receiver] === undefined) {

		return 'Bad Request: Wrong receiver name';
	}

	//If sender not found, return error message

	if (config.senders[sender] === undefined) {

		return 'Bad Request: Sender not found';
	}

	//If bot not found, return error message

	if (config.bots[botname] === undefined) {

		return 'Bad Request: Wrong bot name';
	}

	//If password missmatch, return error message

	if (password !== config.senders[sender].password1 &&
		password !== config.senders[sender].password2) {

		return 'Bad Request: Password not match';
	}

	//If there are not any error, return Success

	return 'Message verified';

}

module.exports = {
	'verifiyMessage': verifiyMessage
};