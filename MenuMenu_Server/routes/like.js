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
 * Path         : http://52.26.16.48:3000/like/foodlike
 * Description  : 음식 즐겨찾기를 추가합니다.
 */
//음식
//등록
//즐겨찾기 클릭 -> 클라 req 유저 이메일, mnum -> insert into foodlove mnum, email -> res

router.post('/foodlike', function(req, res, next) { //post(보안)는 보내기 get은 요청 둘 다 정보는 보냄
    //console.log("들어옴");     
    var email= req.body.email;
    var mnum= req.body.mnum;
    //var num=req.body.num;
    
       
    connection.query('select * from foodlike where email=? and mnum=? ;', // 목록에 이미 있는지 확인  
                     [email,mnum],
                    function(error, cursor){
          
            if(!error){ 
                if(cursor[0]){ // 목록에 있을 때 
                    //debug
                    //console.log('목록에 있습니다. ');   
                         connection.query('delete from foodlike where email=?;', [email], function(error, rows, fields) {
                                if(!error) {
                                    //debug
                                    //console.log("즐겨찾기 제거 성공");
                                    res.status(200).json([{"result" : "success"}]);
                                }
                                else {
                                    res.status(501).json([{"result" : "DBerror"}]);
                                }
                            });
                    
                }else{ //목록에 없을 때
                    
                 connection.query('insert into foodlike ( mnum, email ) values (?,?);',  
                     [mnum,email],
                     function(error, cursor){
                      if(cursor[0]){ 
                        
                          console.log("a");
                        
                        }else{
                            //debug
                            //console.log("등록 성공");  
                            res.status(200).json({ message : 'success'});
                        }
                });
        }              
            
            }else{
                //debug
                //console.log('db에러');
            }
    });
});

/*
 * Method       : get
 * Path         : http://52.26.16.48:3000/like/foodlike/{email}
 * Description  : 음식 즐겨찾기를 조회합니다.
 */
router.get('/foodlike/:email', 
           function(req, res, next) {
    
  // 조건을 만족한 회원의 정보를 받아옴
  connection.query('select * from foodlike where email=? ', 
                   [req.params.email], 
                   function (error, cursor) {
    
        console.log("성공");
        //res.status(200);
      if (error == null) {
          if (cursor.length > 0) {
              res.status(200).json(cursor);  
              
          } else {
              res.status(503).json({ message : 'Can not find email' });
          }
      } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find trade', error });
      }
  });
});


/*
 * Method       : POST
 * Path         : http://52.26.16.48:3000/like/restaurantlike
 * Description  : 식당 즐겨찾기를 추가합니다.
 */
//식당
//등록
//즐겨찾기 클릭 -> 클라 req 유저 이메일, mnum -> insert into foodlove mnum, email -> res

router.post('/restaurantlike', function(req, res, next) { //post(보안)는 보내기 get은 요청 둘 다 정보는 보냄
    //debug
    //console.log("들어옴");     
    var email= req.body.email;
    var rname= req.body.rname; 
    //var num=req.body.num; // 식당즐겨찾기 pk
       
    connection.query('select * from restaurantlike where email=? and rname=? ;', // 목록에 이미 있는지 확인  
                     [email,rname],
                    function(error, cursor){
              
        if(!error){
            if(cursor[0]){ // 목록에 있을 때 
               //debug
                // console.log('목록에 이미 있습니다.  ');   
               // res.status(503).json({ message : '이미 있어요' });
                 connection.query('delete from restaurantlike where email=? and rname=?;', 
                                  [email,rname], 
                                  function(error, rows, fields) {
                                if(!error) {
                                    // debug
                                    // console.log("즐겨찾기 제거 성공");
                                    res.json([{"result" : "success"}]);
                                }
                                else {
                                    res.json([{"result" : "DBerror"}]);
                                }
                            });
            }else{
                connection.query('insert into restaurantlike ( rname, email ) values (?,?);',  
                     [rname,email],
                     function(error, cursor){
                       if(error){
                            //debug
                            //console.log(error);
                            //res.status(200).json({ message : '\n rname =' + rname + '\n email =' + email + '\n 추가 했어요'});
                        
                        }else{
                            res.status(200).json({ message : 'success'});
                        }
                });   
            }
        }else{
            console.log("d");
        } 
           
    });
});
        

/*
 * Method       : get
 * Path         : http://52.78.47.144:3000/like/restauramtlike/{email}
 * Description  : 음식 즐겨찾기를 조회합니다.
 */

router.get('/restaurantlike/:email', 
           function(req, res, next) {
    
  // 조건을 만족한 회원의 정보를 받아옴
  connection.query('select * from restaurantlike where email=? ',  //num, email,rname
                   [req.params.email], 
                   function (error, cursor) {
        //debug
        //console.log("성공");
      if (error == null) {
          if (cursor.length > 0) {
              res.status(200).json(cursor);  
              
          } else {
              res.status(503).json({ message : '이메일이 없어요' });
          }
      } else {
      // Sever DB error
      // res.status(503).json({ result : false, message : 'Can not find trade', error });
      }
  });
});

module.exports = router;

        
        