'use strict';

var express = require('express');
var supertest = require('supertest');
var logger = require('log4js').getLogger('Unit-Test');
var testUtil = require('./common/testutil.js');
var message = require('../atmessager/views/message.js');

var nconf = require('nconf');
nconf.argv()
		 .env()
		 .file({ file: 'config.json' });

var app = testUtil.configExpress(express());

var request = supertest(app);

app.get('/message',message.sendMessage);

exports['Check view health'] = function(test){

	request.get('/message').end(function(err,res){

  test.equal(err,null,'It should not had any error!');

	test.equal(res.statusCode,200,'It should return 200!');

	test.done();
});
}

exports['Test send message'] = {

	'Test send message success':function(test){

		var receiver = nconf.get('message').receiver;
		var botname  = nconf.get('message').botname;
		var password = nconf.get('message').password;

		request.post('/message')
		.send({'receiver':receiver,'botname':botname,'text':'Hello World!'})
		.end(function(err,res){

		  test.equal(err,null,'It should not had any error!')

			test.equal(res.statusCode,201,'It should return 201!');

			test.done();

		});
	},

	'Test send message failed(wrong receiver name)':function(test){

		var receiver = nconf.get('message').receiver;
		var botname  = nconf.get('message').botname;
		var password = nconf.get('message').password;

		request.post('/message')
		.send({'receiver':'Hello Man','botname':botname,'text':'Hello World!'})
		.end(function(err,res){

			test.equal(res.statusCode,400,'It should return 400!');

			test.done();

		});
	},

	'Test send message failed(wrong bot name)':function(test){

		var receiver = nconf.get('message').receiver;
		var botname  = nconf.get('message').botname;
		var password = nconf.get('message').password;

		request.post('/message')
		.send({'receiver':receiver,'botname':'noBot','text':'Hello World!'})
		.end(function(err,res){

			test.equal(res.statusCode,401,'It should return 400!');

			test.done();

		});
	}

	'Test send message failed(miss message name)':function(test){

		var receiver = nconf.get('message').receiver;
		var botname  = nconf.get('message').botname;
		var password = nconf.get('message').password;

		request.post('/message')
		.send({'receiver':receiver,'botname':botname})
		.end(function(err,res){

			test.equal(res.statusCode,401,'It should return 400!');

			test.done();

		});
	}
}
