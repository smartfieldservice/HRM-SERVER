const asyncHandler = require("express-async-handler");

const validateRequest = (schema) => {
    return asyncHandler(async (req, res, next) => {
        const validationOptions = {
            abortEarly: false, //abort after the last validation error
            allowUnknown: true, //allow unknown keys that will be ignored
            stripUnknown: true, //remove unknown keys from the validated data
        };

        try{
            const {error} = await schema.validateAsync(req.body, validationOptions);
            const valid = error == null;
            if(valid){
                next();
            }
        } catch (error) {
            const { details } = error;
            const message = details.map((i) => i.message).join(", ");

            res.status(422);
            throw new Error(`Invalid request data. ${message.replace(/['"]/g, "")}`);
        }
    });
};

module.exports = validateRequest;