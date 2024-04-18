//@external module
const { isValidObjectId } = require("mongoose");

//@internal module
const { Document } = require("../models/modelExporter");
const { pagination, 
        generateSlug } = require("../utils/common");

//@desc get all documents
//@route Get /api/document?page=1&limit=3&sort=
//@access hr/branch-hr
const allDocument = async(req, res) => {
    
    try {

        let concernId = undefined;
        
        //@after giving the role then use it as concernId
        //concernId = req.account.concernId;

        let documents;

        if(!concernId){
            //@hr
            documents = Document.find({ }); 
        }else{
            //@branch-hr
            documents = Document.find({ concernId });
        }

        documents = documents.populate({path:'concernId departmentId' , select:'concern department'});

        let sortBy = "-createdAt";
        if(req.query.sort){
            sortBy = req.query.sort.replace(","," ");
        }

        documents = documents.sort(sortBy);


        documents = await pagination(req.query.page, req.query.limit, documents);
        
        res.status(201).json({message : `${documents.length} document's found !`,documents });
    
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@create a new document
//@route Post /api/document/
//@access hr/branch-hr
const createDocument = async( req, res) => {
    
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
}

//@edit a document
//@route Put /api/document?id=<document_id>
//@access hr/branch-hr
const editDocument = async( req, res) => {
    
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

                res.status(201).json({message : "Document edited successfully !"});
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@delete a document
//@route Delete /api/document?id=<document_id>
//@access hr/branch-hr
const deleteDocument = async( req, res) => {
    
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
                res.status(201).json({message : "Document deleted successfully !"});
            }
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//exports
module.exports = {  allDocument,
                    createDocument,
                    editDocument,
                    deleteDocument
                }