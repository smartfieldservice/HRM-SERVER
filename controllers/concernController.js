//@external module
const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");

//@internal module
const { Concern } = require("../models/modelExporter");
const { generateSlug, 
        pagination } =require("../utils/common");

//@desc get all concern
//route Get /api/concern?page=&limit=&sort=
//@access hr
const allConcern = asyncHandler(async(req,res) => {

    try {

        const { page, limit, sort} = req.query;

        let concerns = Concern.find({});

        let sortBy = "-createdAt";
        if(sort){
            sortBy = sort.replace(","," ");
        }

        concerns = concerns.sort(sortBy);

        concerns = await pagination(page, limit, concerns);

        res.status(200).json({ message : `${concerns.length} concerns found`, data : concerns });

    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@desc create a new concern
//@route Post /api/concern
//@access hr
const createConcern = asyncHandler(async (req, res) => {
   
    try {
        
        const { name, address, description } = req.body;

        const slug = generateSlug(name);
        
        let concern = await Concern.findOne({ slug });

        if(concern){
            res.status(409).json({ message : "Already exist" });
        }else{

            concern = new Concern({
                name ,
                address ,
                logo : req.file.location,
                slug ,
                description
            });
            await concern.save();
            res.status(200).json({ message : "Added successfully", concern });
        }

    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

//@desc edit concern
//@route Put /api/concern?id=<concern_id>
//@access hr
const editConcern = asyncHandler(async (req, res) => {
    
    try {

        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid concern Id" });
        
        }
        else{

            let concern = await Concern.findById({ _id : req.query.id });

            if(!concern){

                res.status(404).json({ message : "Not found" });
            
            }else{
                const { name, address, description } = req.body;

                await Concern.findByIdAndUpdate({ 
                        _id : req.query.id
                    },{
                        name,
                        address,
                        slug : generateSlug(name),
                        description
                    },{ 
                        new : true
                });

                res.status(200).json({ message : "Edited successfully" });
            }
        }
        
    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@desc delete concern
//@route Delete /api/concern?id=<concern_id>
//@access hr
const deleteConcern = asyncHandler(async(req, res) => {

    try {
        
        if(!isValidObjectId(req.query.id)){

            res.status(409).json({ message : "Invalid concern Id" });
        
        }
        else{
            
            const concern = await Concern.findById({ _id : req.query.id });

            if(!concern){
                res.status(404).json({ message : "Not found" });
            }
            else{

                await Concern.findByIdAndDelete({ _id : req.query.id });
                res.status(200).json({ message : "Deleted successfully" });
            }
        }
    } catch (error) {
        res.status(400).json({ message : error.message });
    }

});

//@exports
module.exports = {  allConcern,
                    createConcern,
                    editConcern,
                    deleteConcern
                }