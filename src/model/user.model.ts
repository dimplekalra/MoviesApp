import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { saltWorkFactor } from "../utils/secrets";
// import config from "config";

export interface IUserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (this: IUserDocument, next: any) {
  let user = this as IUserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  let workFactor = saltWorkFactor || 10;
  // || config.get("saltWorkFactor") || 10;
  // Random additional data
  workFactor = Number(workFactor);

  const salt = await bcrypt.genSalt(workFactor);

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<IUserDocument>("User", UserSchema);

export default User;
