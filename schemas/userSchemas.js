const Joi = require("joi");

const registerUserSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string.email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("admin", "hrm", "employee").required(),
});