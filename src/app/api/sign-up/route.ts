import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendEmailVerificationEmail } from "@/helpers/sendVerificationEmail";
import { APIResponse } from "@/helpers/APIResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const existingVerifiedUserByUsername = await UserModel.findOne({ username, isVerified: true });
    // if verified user exists with username; return response...
    if (existingVerifiedUserByUsername) return APIResponse(400, "Username is already taken");

    // user with given username may exists or may not
    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        // user is verified with email so send 400 response
        return APIResponse(400, "Email is already taken");
      } else {
        // user is not verified with email
        // update password and send verification email
        existingUserByEmail.username = username;
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        await existingUserByEmail.save();
      }
    } else {
      // Neither username nor email exists
      // create new user and send verification email...

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    const emailRes = await sendEmailVerificationEmail(email, username, verifyCode);

    if (!emailRes.success) return APIResponse(500, emailRes.message);

    return APIResponse(200, "Account Created Successfully");
  } catch (error) {
    console.error("Error while Registering User!!! : ", error);
    return APIResponse(500, "Error while Registering User");
  }
}
