const jwt= require('jsonwebtoken');

class AuthJwt{
    async authJWT(req,res,next){
        try {
            if(req.cookies && req.cookies.user_token){
                jwt.verify(req.cookies.user_token,'A1B1C1D1',(error,data)=>{
                    if(!error){
                        req.user=data;
                        next();
                    }else{
                        console.log(error);
                        next();
                    }
                })
            }else{
                next();
            }
            
        } catch (error) {
            return error
        }
    }

    async userauthJWT(req,res,next){
        try {
            if(req.cookies && req.cookies.front_user_token){
                jwt.verify(req.cookies.front_user_token,'A1B1C1D1',(error,data)=>{
                    if(!error){
                        req.front_user=data;
                        next();
                    }else{
                        console.log(error);
                        next();
                    }
                })
            }else{
                next();
            }
            
        } catch (error) {
            return error
        }
    }
}
module.exports= new AuthJwt