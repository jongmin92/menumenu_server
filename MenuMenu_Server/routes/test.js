
var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({   //mysql 연결 rds 주소 
  'host' : 'menu.cbtxdzleoryp.ap-northeast-2.rds.amazonaws.com',
  'user' : 'user',
  'password' : 'na448423',
  'database' : 'menumenu',
});

/*
 * Method       : POST
 * Path         : http://52.78.47.144:3000/test/quantity 
 * Description  : 양 평가 추가 
 */
router.post('/quantity', function(req, res, next) {
      var email= req.body.email;
      var mnum = req.body.mnum;
    
    connection.query('select * from test where mnum=? and email=?;',
                    [mnum,email],
                    function(error,cursor){
        if(!error){
            if(!(cursor.length==0) && (cursor[0].quantity==1)){
                //debug
                //console.log("이미 좋아요를 누름");
                res.status(408).json({result:false});
            }else if(!(cursor.length==0) && (cursor[0].quantity==0)){
                 connection.query('update test set quantity=? where email=? and mnum=?;',
                                [1,email,mnum],
                                  function(error, info){
                      if(!error){
                        //debug
                        //console.log("DB에 양평가 여부 등록 성공");
                        //menu 테이블에 총 좋아요 수를 증가시키기 위함...
                        connection.query('select * from menu where num=?;',
                                         [mnum],
                                         function(error, cursor){
                            if(!error){
                                var amount= cursor[0].quantity;
                                amount+=1;
                                connection.query('update menu set quantity=? where num=?;',
                                                 [amount,mnum],
                                                 function(error,cursor){
                                    if(!error){
                                        //debug 
                                        //console.log('menu에 양평가가 +1되었습니다.');
                                         res.status(200).json({result:true});
                                        
                                    }else{
                                        //debug
                                        //console.log("DB에러:"+error);
                                        res.status(501).json({result:false});
                                    }
                                });                                
                                
                            }else{
                               //debug
                                //console.log("DB에러:"+error);
                                res.status(501).json({result:false});
                            }                         
                        });
                      }
                      else{
                          //debug
                          //console.log("DB에러 :"+error);
                          res.status(501).json({result:false});
                      }                
            });}
            else {
                connection.query('insert into test (mnum,email,quantity) values(?,?,?);',
                                [mnum,email,1], function(error, info){
                      if(!error){
                          //debug
                          // console.log("DB에 양평가 여부 등록 성공");
                          // res.status(200).json({result:true});
                          //menu 테이블에 총 좋아요 수를 증가시키기 위함...
                          connection.query('select * from menu where num=?;',
                                         [mnum],
                                         function(error, cursor){
                            if(!error){
                                var amount= cursor[0].quantity;
                                amount+=1;
                                connection.query('update menu set quantity=? where num=?;',
                                                 [amount,mnum],
                                                 function(error,cursor){
                                    if(!error){
                                        //debug
                                        //console.log('menu에 양평가가 +1되었습니다.');
                                         res.status(200).json({result:true});
                                        
                                    }else{
                                        //debug
                                        //console.log("DB에러:"+error);
                                        res.status(501).json({result:false});
                                    }
                                });                        
                             }else{
                               //debug
                               //console.log("DB에러:"+error);
                                res.status(501).json({result:false});
                            }
                        });
                      }
                      else{
                         //debug
                         //console.log("DB에러:"+error);
                          res.status(501).json({result:false});
                      }
                });
            }                        
        }
        else{
            //debug    
            //console.log("DB에러"+error);
            res.status(501).json({result: false});
        }
    });   
 
 
    });
/*
 * Method       : POST
 * Path         : http://52.78.47.144:3000/test/quality
 * Description  : 맛 평가 추가 
 */
router.post('/quality', function(req, res, next) {
      var email= req.body.email;
      var mnum = req.body.mnum;
    
    connection.query('select * from test where mnum=? and email=?;',
                    [mnum,email],
                    function(error,cursor){
        if(!error){
            if(!(cursor.length==0)&& (cursor[0].quality==1)){
                //debug
                //console.log("이미 좋아요를 누름");
                res.status(408).json({result:false});
            }else if(!(cursor.length==0)&&(cursor[0].quality==0)){
                 connection.query('update test set quality=? where email=? and mnum=?;',
                                [1,email,mnum], function(error, info){
                      if(!error){
                          //debug
                          //console.log("DB에 맛평가 여부 등록 성공");
                          //menu 테이블에 총 좋아요 수를 증가시키기 위함...
                          connection.query('select * from menu where num=?;',
                                         [mnum],
                                         function(error, cursor){
                            if(!error){
                                var amount= cursor[0].quality;
                                amount+=1;
                                connection.query('update menu set quality=? where num=?;',
                                                 [amount,mnum],
                                                 function(error,cursor){
                                    if(!error){
                                        //debug 
                                        //console.log('menu에 맛평가가 +1되었습니다.');
                                         res.status(200).json({result:true});
                                        
                                    }else{
                                       //debug
                                        //console.log("DB에러:"+error);
                                        res.status(501).json({result:false});
                                    }
                                });                        
                             }else{
                                //debug
                                 //console.log("DB에러:"+error);
                                res.status(501).json({result:false});
                            }
                        });
                          
                      }
                      else{
                         //debug
                          // console.log("DB에러 :"+error);
                          res.status(501).json({result:false});
                      }             
                 });
            }else {
                connection.query('insert into test (mnum,email,quality) values(?,?,?);',
                                [mnum,email,1], function(error, info){
                      if(!error){
                          //debug
                          //console.log("DB에 맛평가 여부 등록 성공");
                        //  res.status(200).json({result:true});
                          //menu 테이블에 총 좋아요 수를 증가시키기 위함...
                          connection.query('select * from menu where num=?;',
                                         [mnum],
                                         function(error, cursor){
                            if(!error){
                                var amount= cursor[0].quality;
                                amount+=1;
                                connection.query('update menu set quality=? where num=?;',
                                                 [amount,mnum],
                                                 function(error,cursor){
                                    if(!error){
                                         //debug
                                         //console.log('menu에 맛평가가 +1되었습니다.');
                                         res.status(200).json({result:true});                                        
                                    }else{
                                        //debug
                                        //console.log("DB에러:"+error);
                                        res.status(501).json({result:false});
                                    }
                                });                        
                             }else{
                                //debug
                                 //console.log("DB에러:"+error);
                                res.status(501).json({result:false});
                            }
                        });
                      }
                      else{
                          //debug
                          //console.log("DB에러 :"+error);
                          res.status(501).json({result:false});
                      }
                });
            }                        
        }
        else{
            //debug
            //console.log("DB에러"+error);
            res.status(501).json({result: false});
        }
    });
});

module.exports = router;
