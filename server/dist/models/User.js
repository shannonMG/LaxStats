import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// Define the schema for the User document
const userSchema = new Schema({
    role: {
        type: String,
        required: true,
        enum: ['coach', 'player'],
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
const User = model('User', userSchema);
export default User;
