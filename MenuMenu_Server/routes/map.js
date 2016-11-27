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
 * Method       : get
 * Path         : http://52.78.47.144:3000/map/:{x}/:{y}
 * Description  : 사용자의 현재위치에서 특정 반경의 식당을 출력합니다. 
 */

router.get('/:x/:y', function(req,res){ // 거리구하기 
            connection.query('select *,(6371 * acos( cos( radians(?) ) * cos( radians( mapx ) ) * cos( radians( mapy ) - radians(?) ) +                     sin( radians(?) ) * sin( radians( mapx ) ) ) ) AS distance'+
                            ' from restaurant having distance <=0.1'+
                            ' order by distance;',   
                            [req.params.x,req.params.y,req.params.x],
                            function(error, cursor){
         
                if(!error){
                    if(cursor.length>0){ //제대로 들어왔고 DB에 식당이 있을 때
                        res.status(200).json(cursor);
                    }else{ //제대로 들어왔는데 DB에 식당이 없을 때
                        res.status(204).json({ result:false, message: "등록되지않다" });
                    }
                }else{ //들어올 때 에러 있을 경우
                        //debug
                        //console.log(error);
                        res.status(402).json({ result:false, massage : "요청 에러" });
                }
            });
});

module.exports = router;
