const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');

const { concernController } = require("../controllers/controllerExporter");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(path.dirname(__dirname), './AllFileFolder'))
    },
    filename: function(req, file, cb){
        cb(null, shortid.generate() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage,
    limits: {
        fileSize: 99995242880 // 500KB
    }
});

router
    .route("/")
    .get(concernController.allConcern)
    .post(upload.single("logo"), concernController.createConcern)
    .put(concernController.editConcern) 

module.exports = router