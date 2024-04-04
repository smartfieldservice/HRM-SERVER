//@internal module
const Document = require("../models/Document");
const { unlinkFileFromLocal, 
        filesArray, 
        pagination, 
        escapeString,
        generateSlug } = require("../utils/common");

//@show all document
//@http://localhost:8000/api/document/all
//@private route(admin)
const allDocument = async(req, res) => {
    
    try {

        let allDocuments = Document.find({});

        allDocuments = await pagination(req.query.page, req.query.limit, allDocuments);
        
        res.status(201).json({message : `${allDocuments.length} document's found !`,allDocuments});
    
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@search a document using params
//@http://localhost:8000/api/document/search/:doc
//@private route(admin)
const searchDocument = async( req, res) => {
    
    try {
        
        if(req.params.doc !== ""){
            
            const searchQuery = new RegExp(escapeString(req.params.doc),"i");

            const documentData = await Document.find({
                $or  : [
                    {title : searchQuery},
                    {description : searchQuery}
                ]
            });
            
            res.status(201).json({message : `${documentData.length} document's found !`,documentData});
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@add a new document
//@http://localhost:8000/api/document/
//@private hr/branch-hr
const createDocument = async( req, res) => {
    
    try {

        const { title, description, owner }= req.body;

        //@create an array of file locations
        const allFiles = req.files.map((file) => {
            return file.location;
        })

        const newDocument = new Document({
            title ,
            filesName : allFiles,
            description ,
            owner ,
            slug : generateSlug(title)
        });

        await newDocument.save();

        res.status(200).json({ message : "New document added successfully !", data : newDocument });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

//@edit a document using id as query
//@http://localhost:8000/api/document?id=
//@private route(admin)
const editDocument = async( req, res) => {
    
    try {

        const allFiles = filesArray(req.files);
        
        const documentData = await Document.findOne({ _id : req.query.id });

        if(documentData){
            
            const filesDelete = unlinkFileFromLocal(documentData.fileName, "Document");

            const updateDocument = Document.findByIdAndUpdate(
                {   
                    _id : req.query.id
                },
                {
                    title : req.body.title,
                    fileName : allFiles,
                    description : req.body.description,
                    slug : generateSlug(req.body.title)
                },
                { 
                    new : true
                }
            );

            await Promise.all([filesDelete, updateDocument]);

            res.status(201).json({message : "Document edited successfully !"});

        }else{
            await unlinkFileFromLocal(allFiles,"Document");
            throw new Error("Document not found !");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@delete a document using id as query
//@http://localhost:8000/api/document?id=
//@private route(admin)
const deleteDocument = async( req, res) => {
    
    try {
        
        const documentData = await Document.findOne({ _id : req.query.id });

        if(documentData){

            await unlinkFileFromLocal(documentData.fileName,"Document");

            await Document.findByIdAndDelete({ _id : req.query.id });

            res.status(201).json({message : "Document deleted successfully !"});

        }else{
            throw new Error("Document not found !");
        }

    } catch (error) {
        res.status(400).json(error.message);
    }
}

//@for show a single document using slug as query
//@http://localhost:8000/api/document/title?slug=
//@private route(admin)
const singleDocumentView = async(req, res) => {

    try {
        
        const documentData = await Document.findOne({slug : req.query.slug});

        if(documentData){
            res.status(200).json({message : "Document found successfully !", documentData});
        }else{
            throw new Error("Document not found !");
        }
    } catch (error) {
        res.status(400).json(error.message);
    }

}

//exports
module.exports = {  searchDocument,
                    allDocument,
                    createDocument,
                    deleteDocument,
                    editDocument,
                    singleDocumentView
                }