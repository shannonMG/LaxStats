import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Define an interface for the User document
interface IUser extends Document {
  role: string;
  name: string;
  username: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
}

// Define the schema for the User document
const userSchema = new Schema<IUser>(
  {
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

userSchema.pre<IUser>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
