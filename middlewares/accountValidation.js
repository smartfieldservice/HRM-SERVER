//@internal module
const { verifyAuthToken } = require("../utils/common");

//@check is that requested account is logged in or not
const isLogin  = async(req, res, next) => {
    
    try {

        //@get the authToken from Bearer Token
        let authToken = req.get('Authorization');

        if(authToken){

            //@for user validation
            authToken = authToken.split(' ')[1];
            authToken = verifyAuthToken(authToken)

            if(authToken){

                //@create an account to attach the data of the current user
                req.account = authToken;
                //console.log(req.account)
                next();
            }
            else {
                res.status(404).json({ message: "Invalid user" });
            }
        }else{
            res.status(404).json({ message: "Invalid Token" });
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@To check the account role
const requiredRole = function(roleArray){
    
    try {

        return function(req, res, next){

            //check if the role is valid to access the route
            if(req.account && roleArray.includes(req.account.role)){
                next();
            }else{
                throw responseHandler.newError(401);
            }
        }
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//@exports
module.exports = {  isLogin,
                    requiredRole
                }