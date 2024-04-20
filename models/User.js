const { mongoose, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true
        },
        emargencyMobile : {
            type: String,
            required: true
        },
        officeId: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        presentaddress: {
            type: String,
            required: true,
        },
        permanentaddress: {
            type: String,
        },
        city: {
            type: String,
        },
        country: {
            type: String
        },
        imagePath: {
            type: String,
            requried: true
        },
        password: {
            type: String,
            required: true,
            default : "12345"
        },
        concernId : {
            type : Schema.ObjectId,
            ref : "concern",
            default : null
        },
        departmentId : {
            type : Schema.ObjectId,
            ref : "department",
            default : null
        },
        role: {
            type: String,
            enum: ["hr", "branch-hr", "employee"],
            required: true,
        },
    },
    {
        toJSON : {
            transform : function(doc, ret){
                delete ret.password;
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.__v;
            }
        },
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("user", userSchema);
