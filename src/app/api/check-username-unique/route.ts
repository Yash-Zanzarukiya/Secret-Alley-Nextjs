import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { APIResponse } from "@/helpers/APIResponse";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) return APIResponse(400, "", { isAvailable: false });

    const { username } = result.data;

    const isExistingUser = await UserModel.findOne({ username });

    if (isExistingUser) {
      if (isExistingUser.isVerified) {
        return APIResponse(400, "Username is already taken", { isAvailable: false });
      } else if (isExistingUser.verifyCodeExpiry > new Date()) {
        return APIResponse(400, "Username is unavailable right now", { isAvailable: false });
      } else {
        await UserModel.findOneAndDelete({ username });
      }
    }

    return APIResponse(200, "Username is available", { isAvailable: true });
  } catch (error) {
    console.log("CHECK_USERNAME_ERROR:: ", error);
    return APIResponse(500, "An error occurred while checking username uniqueness");
  }
}
