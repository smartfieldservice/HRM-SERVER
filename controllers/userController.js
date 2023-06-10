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


//@desc Authorize user & get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
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
        res.status(401);
        throw new Error("Invalid email or password");
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


//@desc Create New User
//@route POST /API/USERS
//@ACCESS Private/Admin
const createUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    const file = req.file;
    console.log('controler files ssssssdds' + file);
    const result = await uploadFile(file);
    await unlinkfile(file.path);

    const user = await new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        department: req.body.department,
        employeeID: req.body.employeeID,
        designation: req.body.designation,
        presentaddress: req.body.presentaddress,
        permanentaddress: req.body.permanentaddress,
        city: req.body.city,
        country: req.body.country,
        imagePath: result.Location,
        password: req.body.password,
        role: req.body.role,
    });

    try {
        const createUser = await user.save();
        // clearkey(User.collection.collectionName);
        res.status(201);
        res.json(createUser);
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


//@desc Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

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

//@desc Delete single user
//@route GET /api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);

    if(user) {
        await User.deleteOne({ _id: user._id });
        res.json({ message: "User delete successfully" });
    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

module.exports = {
    getUserProfile,
    getSingle,
    authUser,
    createUser,
    getUsers,
    deleteUser,
    updateUserProfile,
}