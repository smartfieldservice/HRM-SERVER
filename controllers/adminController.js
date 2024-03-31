//@internal module
const Admin = require("../models/Admin");
const { hashedPassword, 
        varifyPassword, 
        createAuthToken, 
        escapeString, 
        decodeAccount } = require("../utils/common");

const registerAdmin = async(req, res) => {

    try {

        const adminData = await Admin.findOne({email : req.body.email});

        if(adminData){
            throw new Error("Admin already exist !");
        }

        const hashPassword = await hashedPassword(req.body.password);

        const newAdmin = new Admin({
            name : req.body.name,
            email : req.body.email,
            phone : req.body.phone,
            password : hashPassword,
            address : req.body.address,
            role : req.body.role
        });

        const createAdmin = await newAdmin.save();

        res.status(201).json({message : "Admin registered successfully !",adminData : createAdmin});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const loginAdmin = async(req, res) => {

    try {
        
        const adminData = await Admin.findOne({email : req.body.email});

        if(!adminData){
            throw new Error("Email or Password not matched !");
        }
        else if(!(await varifyPassword(req.body.password,adminData.password))){
            throw new Error("Email or Password not matched !");
        }else{
            
            const adminPayload = {
                data : {
                    id : adminData.id,
                    role : adminData.role
                }
            }

            const token = createAuthToken(adminPayload);

            const authToken = {
                email : adminData.email,
                role : adminData.role,
                token : token
            }

            res.status(200).json({message : "Admin login successfully !", authToken : authToken });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteAdmin = async(req, res) => {
    
    try {

        console.log(req.query.id)

        const adminData = await Admin.findOne({_id : req.query.id});

        if(!adminData){
            throw new Error("Admin Not Found !");
        }

        await Admin.findByIdAndDelete({_id : req.query.id});

        res.status(201).json("Admin Deleted Successfully !");


    } catch (error) {
        res.status(400).json(error.message);
    }
}

const searchAdmin = async(req, res) => {
    
    try {

        const searchQuery = new RegExp(escapeString(req.params.str),"i");
        const phoneQuery = new RegExp("^" + escapeString(req.params.str),"i");

        const adminData = await Admin.find({
            $or : [
                {name : searchQuery},
                {role : searchQuery},
                {phone : phoneQuery}
            ]
        });

        res.status(200).json({message : `${adminData.length} admin's found !`, adminData});

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const allAdmin = async(req, res) => {
    
    try {
        const adminData = await Admin.find({});
        res.status(200).json({message : `${adminData.length} admin's found !`, adminData});

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const adminProfile = async(req, res) => {
    
    try {

        const  decoded = decodeAccount(req.headers['authtoken']);

        const adminData = await Admin.findOne({_id : decoded.data.id});

        res.status(201).json({message : "Admin Found", adminData});

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const updateProfile = async(req, res) => {
    
    try {

        const decoded = decodeAccount(req.headers['authtoken']);

        console.log()

        const adminData = await Admin.findOneAndUpdate({
                _id : decoded.data.id
            },{
                name:req.body.name,
                phone : req.body.phone,
                address:req.body.address
            },{
                new:true
        }); 

        res.status(201).json({message : "Admin Updated Successfully", adminData});

    } catch (error) {
        res.status(400).json(error.message);
    }
}

const logOut = async(req,res) => {
    
    try {

        res.status(200).json({message:"Logout successfully !"});
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@exports
module.exports = {  registerAdmin,
                    loginAdmin,
                    deleteAdmin,
                    searchAdmin,
                    allAdmin,
                    adminProfile,
                    updateProfile,
                    logOut
                }