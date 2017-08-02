var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');
var mailer = require('../mailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/resources', function(req, res, next) {
  res.render('resources');
});

router.get('/faq', function(req, res, next) {
  res.render('faq');
});

router.get('/subscribe', function(req, res) {
  res.render('subscribe');
});


router.post('/subscribe-send', function(req, res) {

    return;

    var email = req.body.email;

    var options = {
      subject: 'Subscribe RevolverCoin', // Subject line
      text: 'New subscriber: ' + email, // plaintext body
      html: null
    };

    mailer.send(options.subject, options.text, options.html, function(error){

      if (error) {
        res.render('subscribe-result', {
          message: 'Error occurred during newsletter subscription. Please check your input and try again.'
        });
      } else
        res.render('subscribe-result', {
          message: 'Thank you! Your email address <span class="email">'+ email +'</span> has been added to the newsletter list'
        });

    });
});



router.post('/invite', function(req, res) {
  if (req.body.email && (!config.inviteToken || (!!config.inviteToken && req.body.token === config.inviteToken))) {

    request.post({
      url: 'https://'+ config.slackUrl + '/api/users.admin.invite',
      form: {
        email: req.body.email,
        token: config.slacktoken,
        set_active: true
      }
    }, function(err, httpResponse, body) {
      // body looks like:
      //   {"ok":true}
      //       or
      //   {"ok":false,"error":"already_invited"}
      if (err) { return res.send('Error:' + err); }
      body = JSON.parse(body);
      if (body.ok) {
        res.render('slack-result', {
          community: config.community,
          message: 'Success! Check your email <span class="email">'+ req.body.email +'</span> for an invite from Slack.'
        });
      } else {
        var error = body.error;
        if (error === 'already_invited' || error === 'already_in_team') {
          res.render('slack-result', {
            community: config.community,
            message: 'Success! You were already invited.<br>' +
            'Visit <a href="https://'+ config.slackUrl +'" target="_blank" class="blue">'+ config.community +'</a>'
          });
          return;
        } else if (error === 'invalid_email') {
          error = 'The email you entered is an invalid email.';
        } else if (error === 'invalid_auth') {
          error = 'Something has gone wrong. Please contact a system administrator.';
        }

        res.render('slack-result', {
          community: config.community,
          message: 'Failed! ' + error,
          isFailed: true
        });
      }
    });
  } else {
    var errMsg = [];
    if (!req.body.email) {
      errMsg.push('your email is required');
    }

    if (!!config.inviteToken) {
      if (!req.body.token) {
        errMsg.push('valid token is required');
      }

      if (req.body.token && req.body.token !== config.inviteToken) {
        errMsg.push('the token you entered is wrong');
      }
    }

    res.render('result', {
      community: config.community,
      message: 'Failed! ' + errMsg.join(' and ') + '.',
      isFailed: true
    });
  }
});


module.exports = router;