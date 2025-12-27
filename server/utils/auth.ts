import { verify, sign } from "jsonwebtoken";
import { AuthRequest, JwtPayload, UserPayload } from "../types";

// set token secret and expiration date
const secret = process.env.JWT_SECRET || "notsosecret";
// Short expiration for portfolio demonstration purposes
const expiration = "3m";

export async function authMiddleware({ req }: AuthRequest) {
  // allows token to be sent via  req.query or headers
  let token = req.body?.token || req.query?.token || req.headers.authorization;

  if (req.headers.authorization) {
    // ["Bearer", "<tokenvalue>"]
    token = token?.split(" ").pop()?.trim();
  }

  if (!token) {
    // no token, return empty object
    return {};
  }

  // verify token and get user data out of it
  try {
    const { data } = verify(token, secret, {
      maxAge: expiration,
    }) as JwtPayload;
    return { user: data };
  } catch (err) {
    console.log("Invalid token: ", (err as Error).message);
    return {};
  }
}

// sign token with user data
export function signToken({ username, email, _id }: UserPayload): string {
  const payload = { username, email, _id };

  return sign({ data: payload }, secret, { expiresIn: expiration });
}

// refresh token
export function refreshToken(token: string): string | null {
  try {
    const { data } = verify(token, secret) as JwtPayload;
    return signToken(data);
  } catch (err) {
    console.log("Invalid token for refresh: ", (err as Error).message);
    return null;
  }
}
