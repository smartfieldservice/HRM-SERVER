//@external module
const asyncHandler = require("express-async-handler");
const faker = require("faker");
const { isValidObjectId } = require("mongoose");

//@internal module
const { User } = require("../models/modelExporter");
const { pagination, 
        generateAuthToken, 
        generateSlug} = require("../utils/common");

//@desc Authorize user & get token during login
//@route POST /api/users/login
//@access hr/branch-hr
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
                token: generateAuthToken(user._id,user.role,generateSlug(user.concern)),
            });
        } else {
            res.status(401).json({ message:"Invalid email or password"});
        }

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

//@http://localhost:8000/api/users
//@ACCESS hr
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
//@ACCESS hr
const createUser = asyncHandler(async (req, res) => {

    try {

        const { name, email, mobile, emargencyMobile, department, employeeID, designation, presentaddress, permanentaddress, city, country, password, role } = req.body;

        let user = await User.findOne({ email });

        if(user){
            res.status(409).json({ message : "Already exist" });
        }
        else{

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
//@http://localhost:8000/api/users?id=
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
//@http://localhost:8000/api/users?id=
//@access hr
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
//@http://localhost:8000/api/users/my-profile
//@access hr/branch-hr
const ownProfile = asyncHandler(async(req, res) => {

    try {
        
        const user = await User.findById({ _id : req.account.id });

        res.status(200).json({ message : "Here is your information" , data : user })

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

});

//@desc get other profile
//@http://localhost:8000/api/users/profile?id=<user_id>
//@access hr
const otherProfile = asyncHandler(async(req, res) => {

    try {
        
        if(!isValidObjectId( req.query.id )){

            res.status(409).json({ message : "Invalid object Id" });

        }else{

            const user = await User.findById({ _id : req.query.id });

            if(!user){
                res.status(404).json({ message: "Not found" });
            }else{
                res.status(404).json({ message: "User found", data : user });
            }
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

module.exports = {  loginUser,
                    allUsers,
                    createUser,
                    editUser,
                    deleteUser,
                    ownProfile,
                    otherProfile
                }