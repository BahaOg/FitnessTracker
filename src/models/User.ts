import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  gender: string;
  height: string;
  weight: string;
  birthDate: string;
  GOAL: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: 50,
      minlength: 3,
    },
    surname: {
      type: String,
      required: [true, 'Please provide a surname'],
      maxlength: 50,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    gender: {
      type: String,
      required: [true, 'Please provide your gender'],
      enum: ['male', 'female'],
    },
    height: {
      type: String,
      required: [true, 'Please provide your height'],
    },
    weight: {
      type: String,
      required: [true, 'Please provide your weight'],
    },
    birthDate: {
      type: String,
      required: [true, 'Please provide your birth date'],
    },
    GOAL: {
      type: String,
      required: [true, 'Please provide your fitness goal'],
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance', 'strength'],
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 