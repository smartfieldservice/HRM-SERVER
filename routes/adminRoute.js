//@external module
const express = require("express");
const router = express.Router();

//@internal module
const { registerAdmin, 
        loginAdmin, 
        logOut, 
        deleteAdmin,
        searchAdmin,
        allAdmin,
        adminProfile,
        updateProfile} = require("../controllers/adminController");
const { isLogin, requiredRole } = require("../middlewares/accountValidation");


//@register an admin
//@private route(super admin)
router.route("/register").get(isLogin,requiredRole(["Super Admin"]),(req,res)=>{res.send("Register an admin by super admin done !")}).
                            post(registerAdmin);

//@login admin
//@private route(any types of admin)
router.route("/login").post(loginAdmin);

//@delete admin
//@private route(super admin)
router.route("/delete").delete(isLogin,requiredRole(["Super Admin"]),deleteAdmin);

//@all admins
//@private route(super admin)
router.route("/all").get(isLogin,requiredRole(["Super Admin"]),allAdmin);

//@search admin using name & role
//@private route(super admin)
router.route("/search/:str").get(isLogin,requiredRole(["Super Admin"]),searchAdmin);

//@admin profile
//@private route
router.route("/myProfile").get(isLogin,requiredRole(["Admin"]),adminProfile).
                            put(updateProfile);

//@logout admin
//@private route(any types of admin)
router.route("/logout").get(logOut);

//@exports
module.exports = router;