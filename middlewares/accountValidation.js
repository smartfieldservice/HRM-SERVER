//@internal module
const { verifyAuthToken, decodeAccount } = require("../utils/common");

//@check is that requested account is logged in or not
const isLogin  = async(req, res, next) => {
    try {

        //verify that this auth-token exist or not
        const verified = verifyAuthToken(req.headers['authtoken']);

        if(verified){

            //decode the token data
            const decoded = decodeAccount(req.headers['authtoken']);

            //attach the token data to the request
            req.account = decoded.data;
            next();
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@To check the account role
const requiredRole = function(roleArray){
    
    try {

        return function(req, res, next) {

            if(req.account){

                if(roleArray[0] === "Admin"){
                    //for all types of admin
                    next();
                }
                else if(roleArray.includes(req.account.role)){
                    //only individual admin
                    next();
                }
                else{
                    res.status(400).json({message:"Invalid Permission !"});
                }
            }else{
                res.status(400).json({message:"Invalid Permission !"});
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