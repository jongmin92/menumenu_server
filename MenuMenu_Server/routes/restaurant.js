var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var path = require('path');
var connection = mysql.createConnection({   //mysql 연결 rds 주소
  'host': 'menu.cbtxdzleoryp.ap-northeast-2.rds.amazonaws.com',
  'user': 'user',
  'password': 'na448423',
  'database': 'menumenu',
});

/*
 * Method       : GET
 * Path         : http://52.78.47.144:3000/restaurant/:{rname}
 * Description  : 식당을 나열합니다. . 
 */

router.get('/:rname', function(req,res){
     connection.query('select * from restaurant where rname=?;',
                      [req.params.rname],  
                      function(error, cursor){
      if(!error){
          if(cursor.length>0){ //제대로 들어왔고 DB에 식당이 있을 때
              res.status(200).json(cursor);
          }
          else{ //제대로 들어왔는데 DB에 식당이 없을 때
              res.status(204).json({ result:false, message: "등록되지않다" });
          }
     } else { //들어올 때 에러 있을 경우
        //debug
        //console.log(error);
        res.status(402).json({ result:false, massage : "요청 에러" });
     }
    }
)});

/*
 * Method       : GET
 * Path         : http://52.78.47.144:3000/menu/smartmenu/:{name}
 * Description  : point 순으로 메뉴를 나열합니다.+ 즐겨찾기 조회
 */

router.get('/smartmenu/:rname/:email', 
           function(req,res){
           var email= req.params.email;
            connection.query('select * from menu where rname=? order by point desc;',
                            [req.params.rname],
                    function(error, cursor){
                if(!error){
                    if(cursor.length>0){
                        connection.query('select * from foodlike where email=?;',
                                        [email],
                                function(error, cursor2){
                            if(!error){
                                if(cursor2.length==0){//좋아요 누른 메뉴가 없을경우
                                    res.status(200).json(cursor);                      
                                }else{
                     
                                    for(var i = 0; i<cursor.length; i++){
                                        for(var j = 0; j<cursor2.length; j++)
                                        {
                                            if(cursor[i].num==cursor2[j].mnum)
                                            {
                                                cursor[i].flike++;
                                            }
                                        }
                                    }
                    
                                    res.status(200).json(cursor);
                                }
                            }else{
                                //debug
                                //console.log('db에러'+error);
                  res.status(501).json({result:false});
                }
                });
            }else{
                res.status(406).json({result:false, message:"일치하는 음식점이 없습니다."});
            }}else{
            console.log('db에러'+error);
            res.status(501).json({result:false});
            }
            });
    });

/*
 * Method       : GET
 * Path         : http://52.78.47.144:3000/restaurant/photo/logo/:{photopath}
 * Description  : 로고 사진의 경로를 검색해서 사진을 보내 줍니다. 
 */
router.get('/photo/logo/:photopath', function(req, res, next) {
    //debug    
    //console.log(__dirname);
    res.status(200).sendFile(path.join(__dirname, '..', 'photo','logo' ,  req.params.photopath+ '.jpg'));     
});

module.exports = router;