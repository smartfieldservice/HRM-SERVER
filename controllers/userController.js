//@external module
const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { ObjectId } = require('mongodb');

//@internal module
const { User, 
        Leave, 
        TotalLeaveOfUser } = require("../models/modelExporter");
const { pagination, 
        generateAuthToken, 
        escapeString, 
        hashedPassword } = require("../utils/common");

//@desc Authorize user & get token during login
//@route Post /api/users/login
//@access hr/branch-hr
const loginUser = asyncHandler(async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password)) && user.role !== 'employee'){
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateAuthToken(user._id,user.role,user.concernId),
            });
        } else {
            res.status(401).json({ message:"Invalid email or password"});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc show all users
//@route Get /api/users
//@access hr/branch-hr
const allUsers = asyncHandler(async(req, res) => {

    try {

        if (req.account && req.account.role) {

            let users;
        
            if(req.account.role === "hr"){
                //@hr
                users = User.find({ });
            }
            else if(req.account.role === "branch-hr"){
                //@branch-hr
                users = User.find({ concernId : req.account.concernId });
            }else{
                //@general employee
                res.status(400).json({ message : "Bad request"});
            }

            users = users.populate({ path : 'concernId departmentId', select : ['name', 'name']});
            users = await pagination(req.query.page, req.query.limit, users);
            
            res.status(200).json({ message : `${users.length} users found`, data : users });

        } else {
            //@unauthorized-person
            return res.status(400).json({ message: "Bad request" });
        }
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

//@desc Create New User
//@route Post /api/users
//@access hr/branch-hr
const createUser = asyncHandler(async (req, res) => {

    try {

        const { name, email, mobile, emargencyMobile, officeId, designation, presentaddress, 
            permanentaddress, city, country, password, role, concernId, departmentId } = req.body;

        let user = await User.findOne({ email });

        if(user){
            res.status(409).json({ message : "Already exist" });
        }
        else{

            //@hash the password
            const hashPassword = await hashedPassword(password);

            user = new User({
                name,
                email,
                mobile,
                emargencyMobile,
                officeId,
                designation,
                presentaddress,
                permanentaddress,
                city,
                country,
                password : hashPassword,
                role,
                concernId,
                departmentId, 
                imagePath : req.file.location
            });

            await user.save();
            res.status(200).json({ message : "Added successfully", user });
        }

    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@desc Update user profile
//@route Put /api/users?id=
//@access hr/branch-hr
const editUser = asyncHandler(async (req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid object Id" });
        
        }else{

            const user = await User.findById({ _id : req.query.id });

            if(user){
                
                const { presentaddress, permanentaddress, city, country } = req.body;

                await User.findByIdAndUpdate({
                        _id : req.query.id
                    },{
                        presentaddress,
                        permanentaddress,
                        city,
                        country
                    },{ 
                        new : true
                });
                
                res.status(200).json({message : "Edited Successfully !"});
                
            }else{
                res.status(404).json({ message: "Not found" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc Delete single user
//@route Delete /api/users?id=
//@access hr/branch-hr
const deleteUser = asyncHandler(async (req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){
            res.status(409).json({ message : "Invalid object Id" });
        }else{

            const user = await User.findById({ _id : req.query.id });

            if(user){
                await User.findByIdAndDelete({ _id : req.query.id });
                res.json({ message: "User delete successfully" });
            }else{
                res.status(404).json({ message: "Not found" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc get own profile
//@route Get /api/users/my-profile
//@access hr/branch-hr
const ownProfile = asyncHandler(async(req, res) => {

    try {
        
        if(!req.account){
            res.status(400).json({ message : 'You need to login'});
        }else{

            let user  = User.findById({ _id : req.account.id }).populate({ path : 'concernId departmentId' , select :[ 'name' , 'name']});

            if(!user){
                res.status(404).json({ message : 'Not found any user !'});
            }
            else{
                
                //@fetch the data
                user = await user;
                res.status(200).json({ message : "Here is your information" , data : user })
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc get other profile & total leave
//@route Get /api/users/profile?id=<user_id>
//@access hr/branch-hr
const otherProfile = asyncHandler(async(req, res) => {

    try {
        
        if(!isValidObjectId( req.query.id )){

            res.status(409).json({ message : "Invalid object Id" });

        }else{

            let user = User.findById({ _id : req.query.id }).populate({ path : 'concernId departmentId', select : ['name', 'name']});

            if(!user){
                res.status(404).json({ message: "Not found" });
            }else{
                
                //@details of the user
                user = await user;

                //@for all leave of this employee
                const allLeaves = await Leave.find({ employeeId : req.query.id });

                //@for total leave sum of this employee
                const totalLeaves = await TotalLeaveOfUser.findOne({ employeeId : req.query.id });
                
                res.status(200).json({ message: "User found", data : user , allLeaves ,  totalLeaves });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

//@desc get concern & department wise user
//@route Get /api/users/concern-department?c_id=<concern_id>&d_id=<department_id>
//@access hr/branch-hr
const concernAndDepartmentWiseUser = asyncHandler(async(req, res) => {
    
    try {

        if(!isValidObjectId(req.query.c_id) || !isValidObjectId(req.query.d_id)){
            
            res.status(209).json({ message : "Invalid Id !"});
        
        }else{

            const users = await User.find({ 
                $and : [
                    { concernId : req.query.c_id },
                    { departmentId : req.query.d_id }
                ]
            });
    
            res.status(200).json({ message : `${users.length} users found !`, data : users });
        }
       
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

//@desc search users
//@route Get /api/users/search
//@access hr/branch-hr
const searchUser = asyncHandler( async(req, res) => {

    try {
        
        if( req.params.clue !== ""){

            const  searchQuery = new RegExp( escapeString( req.params.clue ), "i" );
            const  strictQuery = new RegExp( "^" + escapeString( req.params.clue ), "i" );
            
            if (req.account && req.account.role) {
                
                let users;
                
                if(req.account.role === "hr"){
                    //@hr
                    users = await User.aggregate([
                        {
                            $lookup: {
                                from: "concerns", 
                                localField: "concernId",
                                foreignField: "_id",
                                as: "concern"
                            }
                        },{
                            $lookup: {
                                from: "departments", 
                                localField: "departmentId",
                                foreignField: "_id",
                                as: "department"
                            }
                        },{
                            $match: {
                                $or: [
                                    { 'concern.name': searchQuery },
                                    { 'department.name': searchQuery },
                                    { name : searchQuery },
                                    { role : searchQuery },
                                    { designation : searchQuery },
                                    { officeId: strictQuery },
                                    { mobile : strictQuery },
                                    { email : strictQuery }
                                ]
                            }
                        }
                    ]);
                }else if(req.account.role === "branch-hr"){
                    //@branch-hr
                    users = await User.aggregate([
                        {
                            $lookup: {
                                from: "departments", 
                                localField: "departmentId",
                                foreignField: "_id",
                                as: "department"
                            }
                        },{
                            $match: {
                                $and:[
                                    { concernId : new ObjectId( req.account.concernId )},
                                    {
                                        $or: [
                                            { 'department.name': searchQuery },
                                            { name : searchQuery },
                                            { role : searchQuery },
                                            { designation : searchQuery },
                                            { officeId: strictQuery },
                                            { mobile : strictQuery },
                                            { email : strictQuery }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]);
                }else{
                    //@general employee
                    res.status(400).json({ message : "Bad request"});
                }

                res.status(200).json({ message : `${users.length} result found !`, data : users });
            
            }else {
                //@unauthorized-person
                return res.status(400).json({ message: "Bad request" });
            }
        }
    } catch (error) {
        res.status(400).json({ message : error.message });        
    }
});

//@exports
module.exports = {  loginUser,
                    allUsers,
                    createUser,
                    editUser,
                    deleteUser,
                    ownProfile,
                    otherProfile,
                    concernAndDepartmentWiseUser,
                    searchUser
                }