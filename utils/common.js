//@external module
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@function for regular expression string
const escapeString = function(str){
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); 
};

//@function for pagination using data as object
const asyncPagination = async(pageNo, pageLimit, data) => {
    
    try {
        const page = parseInt(pageNo) || 1;
        const limit = parseInt(pageLimit);
        const skip = (page -1) * limit;

        return await data.skip(skip).limit(limit);

    } catch (error) {
        return error;
    }
}

//@function for pagination using data as real data
const syncPagination = function(pageNo, pageLimit, data) {
        
    const page = parseInt(pageNo) || 1;
    const limit = parseInt(pageLimit);
    const skip = (page - 1) * limit;

    return data.slice(skip, skip + limit);
}

//@function for hash the password
const hashedPassword = async(password) => {
    try {
        return await bcrypt.hash(password,10);
    } catch (error) {
        return error;
    }
}

//@function for verify password
const varifyPassword = async(inputPassword, hashPassword) => {
    try {
        return await bcrypt.compare(inputPassword,hashPassword);
    } catch (error) {
        return error;
    }
}

//@function for create an Authentication token for an account using jwt
const generateAuthToken = (id,role,concernId) => {
    return jwt.sign({ id,role,concernId }, process.env.JWT_SECRET, { expiresIn: "14d" });
};

//@function for verify Authentication token of an account using jwt
const verifyAuthToken = function(authToken){
    return jwt.verify(authToken,process.env.JWT_SECRET);
}

//@function for decode an account of user or admin
const decodeAccount = function(authToken){
    return jwt.decode(authToken);
}

//@generate a slug from the given string
const generateSlug = function(str){
    return str.toLowerCase().replace(/\s+/g, "-");
};

//@start date of a year like "2024-01-01"
const startYear = function(year){
    return `${year}-${String(0 + 1).padStart(2, '0')}-${String(1).padStart(2, '0')}`;
}

//@end date of a year like "2024-31-12"
const endYear = function(year){
    return `${year}-${String(11 + 1).padStart(2, '0')}-${String(31).padStart(2, '0')}`;
}



//@exports
module.exports = {  escapeString,
                    asyncPagination,
                    syncPagination,
                    hashedPassword,
                    varifyPassword,
                    generateAuthToken,
                    verifyAuthToken,
                    decodeAccount,
                    generateSlug,
                    startYear,
                    endYear
                }