//@external module
const asyncHandler = require('express-async-handler');
const { ObjectId } = require('mongodb');
const { isValidObjectId } = require("mongoose");

//@internal module
const { Document } = require("../models/modelExporter");
const { pagination, 
        generateSlug, 
        escapeString } = require("../utils/common");

//@desc get all documents
//@route Get /api/document?page=1&limit=3&sort=
//@access hr/branch-hr
const allDocument = asyncHandler(async(req, res) => {
    
    try {

        if (req.account && req.account.role) {

            let documents;

            if(req.account.role === "hr"){
                //@hr
                documents = Document.find({ });

            }else if(req.account.role === "branch-hr"){
                //@branch-hr
                documents = Document.find({ concernId: req.account.concernId });

            }else{
               //@employee
               return res.status(400).json({ message: "Bad request" });
            }

            documents = documents.populate({ path:'concernId departmentId' , select:'name name' });

            let sortBy = "-createdAt";
            if(req.query.sort){
                sortBy = req.query.sort.replace(","," ");
            }

            documents = documents.sort(sortBy);
            documents = await pagination(req.query.page, req.query.limit, documents);
            
            res.status(200).json({message : `${documents.length} document's found !`,documents });
    
        } else {
            //@unauthorized-person
            return res.status(400).json({ message: "Bad request" });
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//@create a new document
//@route Post /api/document/
//@access hr/branch-hr
const createDocument = asyncHandler(async( req, res) => {
    
    try {

        const { title, description, concernId, departmentId }= req.body;

        const slug = generateSlug(title);

        let document = await Document.findOne({ slug });

        if(document){

            res.status(409).json({ message : " Already exists !"});

        }else{

            //@create an array of file locations
            const allFiles = req.files.map((file) => {
                return file.location;
            });

            document = new Document({
                title ,
                filesName : allFiles,
                description ,
                concernId ,
                departmentId ,
                slug
            });

            await document.save();
            res.status(200).json({ message : "New document added successfully !", data : document });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//@edit a document
//@route Put /api/document?id=<document_id>
//@access hr/branch-hr
const editDocument = asyncHandler(async( req, res) => {
    
    try {

        if(!isValidObjectId(req.query.id)){
            res.status(409).json({ message : "Invalid document Id"});
        }else{

            const document = await Document.findById({ _id : req.query.id });
            
            if(!document){
                res.status(404).json({ message : "Not found" });
            }else{

                const { title, description } = req.body;

                await Document.findByIdAndUpdate({ 
                        _id : req.query.id
                    },{
                        title,
                        description,
                        slug : generateSlug(req.body.title)
                    },{ 
                        new : true
                });

                res.status(200).json({message : "Document edited successfully !"});
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//@delete a document
//@route Delete /api/document?id=<document_id>
//@access hr/branch-hr
const deleteDocument = asyncHandler(async( req, res) => {
    
    try {

        if(!isValidObjectId(req.query.id)){
            res.status(409).json({ message : "Invalid document Id"});
        }
        else{

            const documentData = await Document.findById({ _id : req.query.id });

            if(!documentData){
                res.status(404).json({ message : "Not found" });
            }else{

                await Document.findByIdAndDelete({ _id : req.query.id });
                res.status(200).json({message : "Document deleted successfully !"});
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//@desc search document
//@route Get /api/document/search/:clue
//@access hr/branch-hr
const searchDocument = asyncHandler(async(req, res) => {

    try {
        
        if(req.params.str !== ""){

            const searchQuery = new RegExp( escapeString(req.params.clue), "i");

            if (req.account && req.account.role) {

                let documents;
    
                if(req.account.role === "hr"){
                    //@hr
                    documents = await Document.aggregate([
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
                            $match:{
                                $or:[
                                    { 'concern.name': searchQuery },
                                    { 'department.name': searchQuery },
                                    { title: searchQuery },
                                ]
                            }
                        }
                    ]);
                }else if(req.account.role === "branch-hr"){
                    //@branch-hr
                    documents = await Document.aggregate([
                        {
                            $lookup: {
                                from: "departments", 
                                localField: "departmentId",
                                foreignField: "_id",
                                as: "department"
                            }
                        },{
                            $match:{
                                $and: [
                                    { concernId : new ObjectId( req.account.concernId ) },
                                    {
                                        $or: [
                                            { 'department.name': searchQuery },
                                            { title: searchQuery },
                                        ]
                                    }
                                ]
                            }
                        }
                    ]);
                }else{
                   //@employee
                   return res.status(400).json({ message: "Bad request" });
                }

                documents = documents.populate({ path:'concernId departmentId' , select:'name name' });
    
                let sortBy = "-createdAt";
                if(req.query.sort){
                    sortBy = req.query.sort.replace(","," ");
                }
    
                documents = documents.sort(sortBy);
                documents = await pagination(req.query.page, req.query.limit, documents);
                
                res.status(200).json({message : `${documents.length} document's found !`,documents });
        
            } else {
                //@unauthorized-person
                return res.status(400).json({ message: "Bad request" });
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
});

//exports
module.exports = {  allDocument,
                    createDocument,
                    editDocument,
                    deleteDocument,
                    searchDocument
                }