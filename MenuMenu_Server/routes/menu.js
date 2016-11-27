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
 * Path         : http://52.78.47.144:3000/menu/:{name}
 * Description  : 메뉴를 출력합니다.  
 */

router.get('/:name', function(req,res){
     connection.query('select * from menu where rname=?;',  
                      [req.params.name],  
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

router.get('/smartmenu/:rname/:email', function(req,res){
    var email= req.params.email;
    
    connection.query('select * from menu where rname=? order by point desc;',
         [req.params.rname],
         function(error, cursor){
        if(!error){
            if(cursor.length>0){
                //res.status(200).json(cursor);
                connection.query('select * from foodlike where email=?;',
                                [email],
                                function(error, cursor2){
              if(!error){
                  if(cursor2.length==0){//좋아요 누른 메뉴가 없을경우
                      res.status(200).json(cursor);                      
                  }
                  else{
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
                  }}
              /*  if(cursor2.length==0){// 즐겨찾기 등록하지 않은 레스토랑인 경우
                    res.status(200).json(cursor);
                    
                }else{// 즐겨찾기 등록한 레스토랑인 경우
                    
                    res.status(202).json(cursor);
                   
                    
                }}*/
              else{
                  //debug
                  //console.log('db에러'+error);
                  res.status(501).json({result:false});
              }
                });
                        
                    
            }else{
                res.status(406).json({result:false, message:"일치하는 음식점이 없습니다."});
            }
            
            
        }else{
            //debug
            //console.log('db에러'+error);
            res.status(501).json({result:false});
        }
});
});

/*
 * Method       : GET
 * Path         : http://52.78.47.144:3000/menu/photo/menu/:{photopath}
 * Description  :  사진의 경로를 검색해서 사진을 보내 줍니다. 
 */

router.get('/photo/menu/:photopath', function(req, res, next) {
    //debug   
    //console.log(__dirname);
    res.status(200).sendFile(path.join(__dirname, '..', 'photo','menu' ,  req.params.photopath+ '.JPG'));     
});

    //console.log(path.join(__dirname, '..', 'photo','logo','desert', req.params.name + '.png'));
  // EC2에서의 코드
  //res.status(200).sendFile(path.join(__dirname, '..', 'photo','desert', 'logo' , req.params.name + '.png'));
  // debug
  // res.status(200).sendFile(path.join(__dirname, '..', 'photos', req.params.bnum + '.jpg'));

  // 절대 경로로 응답
  // res.status(200).sendFile('C:\\Users\\JongMin\\Documents\\Study\\SOPT\\sopt_workspace\\SecondBook_Server\\photos\\' + req.params.bnum + '.jpg');

/*
router.get('/photo/:num/:name', function(req, res, next) {
    console.log(__dirname);
    var categry = req.params.num;
    connection.query('select category from menu where num=?;',  
                     [req.params.num],//메뉴 num   
                     function(error, cursor){
            
            console.log("a");
          if(!error){
            if(cursor.length>0){ //제대로 들어왔고 DB에 있을 때
                
                //res.status(200).json(cursor);
                //console.log(cursor[0].category);
                res.status(200).sendFile(path.join(__dirname, '..', 'photo','logo' ,cursor[0].category,  req.params.name + '.jpg'));
            }
            else{ //제대로 들어왔는데 DB에 없을 때
                res.status(204).json({ result:false, message: "등록되지않다" });
            }
          } else { //들어올 때 에러 있을 경우
              console.log(error);
              res.status(402).json({ result:false, massage : "요청 에러" });
        }
     });
    //console.log(path.join(__dirname, '..', 'photo','logo','desert', req.params.name + '.png'));
  // EC2에서의 코드
  //res.status(200).sendFile(path.join(__dirname, '..', 'photo','desert', 'logo' , req.params.name + '.png'));
  // debug
  // res.status(200).sendFile(path.join(__dirname, '..', 'photos', req.params.bnum + '.jpg'));

  // 절대 경로로 응답
  // res.status(200).sendFile('C:\\Users\\JongMin\\Documents\\Study\\SOPT\\sopt_workspace\\SecondBook_Server\\photos\\' + req.params.bnum + '.jpg');

});
router.post('/',function(request, response){
    console.log("됬다");
    console.log("hello");
    response.redirect('/');
});*/

module.exports = router;