var logger = require('log4js').getLogger('APP_LOG');
var request = require('request');

function sendMessage(config, sender, receiver, message, botname, callback) {

    var chat_id = config.receivers[receiver].chat_id;
    var token = config.bots[botname].token;
    var prefix = '';

    if(config.senders[sender].prefix){

        prefix = config.senders[sender].prefix;

        message = prefix + message;
    }

    request.post({
        url: 'https://api.telegram.org/bot' + token + '/sendMessage',
        form: {
            chat_id: chat_id,
            text: message
        }
    },
    function(err, res, body) {

        body = JSON.parse(body);

        if (err) {
            logger.error(err);
            callback(err, null);
            return;
        }

        if (body['error_code']) {

            logger.error(body['description']);

            err = {
                error_code: body['error_code'],
                description: body['description']
            };

            callback(err, null);

            return;
        }

        logger.info('Message sent!');

        var successMessage = {
            receiver: receiver,
            botname: botname,
            message: message,
            sendTime: new Date()
        };

        callback(null, successMessage);

    });
}

module.exports = {
    'sendMessage': sendMessage
};
