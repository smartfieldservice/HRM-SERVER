//@external module
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const util = require('util');
const unlinkfile = util.promisify(fs.unlink);

//@internal module
const { Concern } = require("../models/modelExporter");
const { generateSlug, pagination } =require("../utils/common");
const { uploadFile } = require('../s3');


//@get concern
//@access by super HR
const allConcern = asyncHandler(async(req,res) => {

    try {

        console.log("i am here")

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

//@create concern
//@access by super HR
const createConcern = asyncHandler(async (req, res) => {
   
    try {
        
        const { name, address, description } = req.body;

        console.log(name)

        const slug = generateSlug(name);
        
        let concern = await Concern.findOne({ slug });

        if(concern){
            res.status(409).json({ message : "Already exist" });
        }else{

            const file = req.file;
            const result = await uploadFile(file);
            await unlinkfile(file.path);

            concern = new Concern({
                name ,
                address ,
                logo : result.Location ,
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

//@edit concern
//@access by super HR
const editConcern = asyncHandler(async (req, res) => {
    
    try {

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

            res.status(200).json({ message : "Updated successfully" });
        }
        
    } catch (error) {
        res.status(400).json({ message : error.message });
    }
});

module.exports = {  allConcern,
                    createConcern,
                    editConcern
                }