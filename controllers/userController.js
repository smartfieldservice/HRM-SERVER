const asyncHandler = require("express-async-handler");
const faker = require("faker");
const { clearkey } = require("../utils/cache");
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

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });

    try {
        const createUser = await user.save();
        // clearkey(User.collection.collectionName);
        res.json(createUser);
    }catch (error) {
        res.json({ message: error });
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
    getSingle,
    authUser,
    createUser,
    getUsers,
    deleteUser,
}