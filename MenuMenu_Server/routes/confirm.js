/*
 * demailer = 인증 메일링을 위해 추가
 * mathjs = 난수 계산을 위해 추가
 */
var express = require('express');
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var math = require('mathjs');
var router = express.Router();
var connection = mysql.createConnection({
  'host': 'menu.cbtxdzleoryp.ap-northeast-2.rds.amazonaws.com',
  'user': 'user',
  'password': 'na448423',
  'database': 'menumenu',
});

/*
 * Method       : POST
 * Path         :  http://52.78.47.144/confirm/email
 * Description  : 사용자 이메일로 인증번호를 요청받습니다.
 */
router.post('/email', function(req, res, next) {
  
  // 1000~9999 난수(인증번호) 생성
  var confirmkey = Math.floor(Math.random()*(10000)) + 1;
  var email = req.body.email;
  // ex value -> confirmkey = 1249, email : 201101563@inu.ac.kr
  
  // debug
  // console.log('email = ' + email);
  // console.log('confirmkey = ' +confirmkey);
  
  /*
   * 이메일 인증 요청을 처음한 경우 : 새로 인증번호를 만들어 DB에 저장한 후 인증메일을 보낸다.
   * 이메일 인증 요청을 여러번 한 경우 : 새로운 인증번호를 DB에 UPDATE한 후 인증메일을 보낸다.
   */
  connection.query('select * from Confirm where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor.length == 0) {
        connection.query('insert into Confirm (email, confirmkey) values (?,?);',
                         [req.body.email, confirmkey], function (error, info) {
          if (error == null) {
            // smtp 인증
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'kdhx92@gmail.com',
                pass: 'whdals1@'
              }
            }, {
              // 보내는 사람
              from: 'master@menumenu.org',
              headers: {
                'My-Awesome-Header': '123'
              }
            });
            // 메일 전송 (받는 사람)
            transporter.sendMail({
              to: req.body.email,
              subject: 'MenuMenu 가입 메일',
              text: 'MenuMenu 가입 인증 번호 : ' + confirmkey,
            });

            res.status(200).json({ result : true });
            // debug
            // console.log('인증번호 발송 -> email : ' + email + ', 인증번호 : ' + confirmkey);
          } else {
            res.status(503).json({ result : false, message : 'Can not send Autho_Email' });
            // debug
            // console.log('인증번호 발송 실패');
          }
        });
      } else {
        connection.query('update Confirm set confirmkey=? where email=?', [confirmkey, req.body.email], function (error, cursor) {
          if (error == null) {
            // smtp 인증
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'kdhx92@gmail.com',
                pass: '12-73023879'
              }
            }, {
              // 보내는 사람
              from: 'master@second_book.org',
              headers: {
                'My-Awesome-Header': '123'
              }
            });
            // 메일 전송 (받는 사람)
            transporter.sendMail({
              to: req.body.email,
              subject: 'Second Book 가입 메일',
              text: 'Second Book 가입 인증 번호 : ' + confirmkey,
            });

            res.status(200).json({ result : true });
            // debug
            // console.log('인증번호 발송 -> email : ' + email + ', 인증번호 : ' + confirmkey);
          } else {
            res.status(503).json({ result : false, message : 'Can not send Autho_Email' });
            // debug
            // console.log('인증번호 발송 실패');
          }
        });
      }
    }
  })
});


/*
 * Method       : POST
 * Path         : http://52.78.47.144:3000/confirm
 * Description  : 이메일과 인증번호를 확인합니다.
 */
router.post('/', function(req, res, next) {
  
  // debug
  // console.log('email = ' + req.body.email + ' | confirmkey = ' + req.body.confirmkey);
  
  // 사용자의 이메일과 인증번호를 DB와 확인합니다. 인증성공시 DB에서 인증번호와 이메일을 삭제합니다.
  connection.query('select * from Confirm where email=?;', [req.body.email], function (error, cursor) {
    if (error == null) {
      if (cursor[0].confirmkey == req.body.confirmkey) {
        connection.query('delete from Confirm where email=?;', [req.body.email], function (error, info) {
          if (error == null) {
            res.status(200).json({ result : true });
          }  
        });
      } else {
        res.status(401).json({ result : false, message : 'Do not correct your confirmkey' })
      }
    } else {
      res.status(503).json({ result : false, message : 'Do not exist confirmkey in DB' });
      // debug
      // console.log('인증번호가 DB에 존재하지 않음(인증메일을 요청해야함)');
    }
  });

});
  
module.exports = router;