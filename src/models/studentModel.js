import mongoose from 'mongoose';

//define schema for admin 
const studentUser = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength:5, maxlength: 10},
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, minlength:5, maxlength: 70},
}, {timestamps: true})

// Create the admin model based on the schema
const Student = mongoose.model('Student', studentUser);

// Export the user model
export default Student;