import { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  resetPIN?: string;
  resetPINExpiry?: Date;
  projects: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isCorrectPassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    resetPIN: String,
    resetPINExpiry: Date,
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function () {
  // Hash the password before saving the user model prevents re-hashing if not modified
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

userSchema.methods.isCorrectPassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser, IUserModel>("User", userSchema);

export default User;
