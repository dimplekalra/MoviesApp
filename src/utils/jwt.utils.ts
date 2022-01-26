import jwt from "jsonwebtoken";
import { privateKey } from "./secrets";

const pKey = (process.env.privateKey as string) || privateKey;

export async function sign(
  object: Object,
  options?: jwt.SignOptions | undefined
) {
  return await jwt.sign(object, pKey, options);
}

export const decode = (token: string) => {
  try {
    const decoded = jwt.verify(token, pKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};
