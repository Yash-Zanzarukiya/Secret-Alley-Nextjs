import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { APIResponse } from "@/helpers/APIResponse";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(AuthOptions);
    const sessionUser = session?.user;

    if (!session || !session.user) return APIResponse(401, "Not authenticated");

    const user = await UserModel.findOne({ _id: sessionUser._id });

    if (!user) return APIResponse(400, "User not found");

    user.isAcceptingMessages = !user.isAcceptingMessages;

    await user.save();

    return APIResponse(200, "Accepting status toggled successfully");
  } catch (error) {
    console.error("TOGGLE_STATUS_ERROR :: ", error);
    return APIResponse(500, "Error occurred while toggling status");
  }
}

export async function GET(request: Request) {
  dbConnect();
  try {
    const session = await getServerSession(AuthOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) return APIResponse(401, "Not authenticated");

    const user = await UserModel.findById(sessionUser._id);

    if (!user) return APIResponse(400, "User not found");

    return APIResponse(200, "Status sent successfully", {
      isAcceptingMessages: user.isAcceptingMessages,
    });
  } catch (error) {
    console.error("GET_STATUS_ERROR :: ", error);
    return APIResponse(500, "Error occurred while fetching status");
  }
}
