import { QueryOptions, UpdateQuery } from "mongoose";
import { DocumentDefinition, FilterQuery } from "mongoose";
import { omit } from "lodash";
import User, { IUserDocument } from "../model/user.model";

export async function createUser(input: DocumentDefinition<IUserDocument>) {
  try {
    return await User.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findUser(query: FilterQuery<IUserDocument>) {
  try {
    return User.findOne(query).lean();
  } catch (error) {
    throw new Error("User Not Found");
  }
}

export function findAndUpdateUser(
  query: FilterQuery<IUserDocument>,
  update: UpdateQuery<IUserDocument>,
  options: QueryOptions
) {
  try {
    return User.findOneAndUpdate(query, update, options);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function removeUser(query: FilterQuery<IUserDocument>) {
  return User.remove(query);
}

export async function validatePassword({
  email,
  password,
}: {
  email: IUserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({
    email,
  });
  if (!user) return false;
  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toObject(), "password");
}
