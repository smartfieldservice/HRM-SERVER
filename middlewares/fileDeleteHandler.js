//external module
const path = require("path");
const fs = require("fs").promises;

const unlinkFile = async(fileName, subFolderPath) => {
    
    try {
        const mainDirectory = path.resolve(__dirname,"..");
        const folderPath = `${mainDirectory}/public/${subFolderPath}/`;

        const filePath = path.join(folderPath,fileName);

        const fileAccess = fs.access(filePath,fs.constants.F_OK);
        const fileUnlink = fs.unlink(filePath);

        return await Promise.all([fileAccess, fileUnlink]);

    } catch (error) {
        return error;
    }
}

//@exports
module.exports = {  unlinkFile
                }