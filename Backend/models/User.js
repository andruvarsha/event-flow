const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 5,
        select: false // Do not return password by default
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    department: {
        type: String,
        default: 'General'
    },
    studentId: {
        type: String,
        sparse: true,
        unique: true
    },
    phone: {
        type: String,
        default: ''
    },
    semester: {
        type: String,
        default: ''
    },
    certificates: [
        {
            title: { type: String, required: true },
            issuedBy: { type: String, required: true },
            date: { type: Date, default: Date.now },
            url: { type: String },
            verificationId: { type: String }
        }
    ]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
