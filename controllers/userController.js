const asyncHandler = require("express-async-handler");
const faker = require("faker");
const { clearkey } = require("../utils/cache");
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);
const path = require('path');
const { uploadFile } = require('../s3');
const User = require("../models/ User");
const generateToken = require("../utils/generateToken");
const { pagination } = require("../utils/common");
const { isValidObjectId } = require("mongoose");


//@http://localhost:8000/api/users
//@ACCESS Private/Admin
const allUsers = asyncHandler(async(req, res) => {

    try {

        let { page, limit } = req.query;

        let users = User.find({});

        users = await pagination(page, limit, users);

        res.status(200).json({ message : `${users.length} users found`, data : users });
        
    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@desc Create New User
//@http://localhost:8000/api/users
//@ACCESS Private/Admin
const createUser = asyncHandler(async (req, res) => {

    try {

        const { name, email, mobile, emargencyMobile, department, employeeID, designation, presentaddress, permanentaddress, city, country, password, role } = req.body;

        let user = await User.findOne({ email });

        if(user){
            res.status(409).json({ message : "Already exist" });
        }
        else{

            const file = req.file;
            const result = await uploadFile(file);
            await unlinkfile(file.path);
                
            user = new User({
                name,
                email,
                mobile,
                emargencyMobile,
                department,
                employeeID,
                designation,
                presentaddress,
                permanentaddress,
                city,
                country,
                password,
                role,
                imagePath : result.Location
            });

            await user.save();

            res.status(200).json({ message : "Added successfully", user });

        }

    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@desc Update user profile
//@http://localhost:8000/api/users?id=
//@access Private
const editUser = asyncHandler(async (req, res) => {

    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid object Id" });
        
        }else{

            const user = await User.findById({ _id : req.query.id });

            if(user){
                

                
            }else{
                res.status(404).json({ message: "Not found" });
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@desc Delete single user
//@http://localhost:8000/api/users?id=
//@access Private/Admin
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

//@desc Authorize user & get token during login
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))){
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message:"Invalid email or password"});
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

//@desc Generate Many new Users
const generateUsers = asyncHandler(async (req, res) => {
    let users = [];
    for (let i = 0; i< 10; i +=1){
        const name = faker.name.findName();

        let newUser = {
            name,
            email: faker.internet.email(name),
            password: "pass12345",
            role: faker.random.arrayElement(["admin", "hrm", "employee"])
        };
        users.push(newUser);
    }

    try {
        const createUsers = await User.insertMany(users);
        res.json(createUsers);
    }catch (error) {
        res.json({ message: error });
    }
});


//@desc Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});




//@desc   GET All Users
//@route  GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    try{
        
        const users = await User.find({}).select("-password").sort({_id: -1 }); //newest first

        res.json({ users });
    }catch (error) {
        res.json({ message: error });
    }
});

//@desc get single user
//@route GET /api/users/:id
//@access Private/Admin
const getSingle = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (user == null) {
            res.json({ message: "User not found" });
        }else {
            res.json(user);
        }
    }catch (error) {
        res.json({ message: error });
    }
});



module.exports = {  allUsers,
                    createUser,
                    editUser,
                    deleteUser,
                    getUserProfile,
                    getSingle,
                    loginUser,
                    getUsers
                }