var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({   //mysql 연결 rds 주소
  'host': 'menu.cbtxdzleoryp.ap-northeast-2.rds.amazonaws.com',
  'user': 'user',
  'password': 'na448423',
  'database': 'menumenu',
});

/*
 * Method       : POST
 * Path         : http://52.78.47.144:3000/join
 * Description  : 회원가입을 합니다.
 */
router.post('/', function (req, res, next) { //post(보안)는 보내기 get은 요청 둘 다 정보는 보냄
  var email = req.body.email;
  var pw = req.body.pw;
  var birth = req.body.birth;
  var gender = req.body.gender;

  // debug
  //console.log("email = " + email + "\npw = " + pw + "\nbirth = " + birth + "\ngender = " + gender);

  connection.query('select * from user where email=?;',
    [email],
    function (error, cursor) {
      if (!error) {
        if (!(cursor.length == 0) && cursor[0].email == email) {
            // debug
            // console.log("이미 존재하는 ID!!!!!");
          res.status(406).json({result: false});
        } else {
          // DB 삽입
          connection.query('insert into user (email, pw, birth, gender) values (?, ?, ?, ?);',
            [email, pw, birth, gender],
            function (error, info) {
              if (!error) {
                  // debug
                  //console.log("DB에 사용자 등록 성공!");
                res.status(200).json({result: true});
              } else {
                  // debug
                  //console.log("DB Error!!!!\n" + error);
                res.status(404).json({result: false});
              }
                });
            }
        } else {
        //debug
        //console.log("DB Error!!!!\n" + error);
        res.status(404).json({result: false});
        }
    });
});

module.exports = router;