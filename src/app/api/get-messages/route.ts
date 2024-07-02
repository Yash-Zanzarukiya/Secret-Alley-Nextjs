import { APIResponse } from "@/helpers/APIResponse";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(AuthOptions);
    const sessionUser = session?.user;

    if (!session || !sessionUser) return APIResponse(400, "Not authenticated");

    // TODO : add user invalid userId user not found logic

    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(sessionUser._id),
        },
      },
      {
        $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    return APIResponse(200, "Messages sent successfully", user[0].messages);
  } catch (error) {
    console.error("GET_MESSAGES_ERROR :: ", error);
    return APIResponse(500, "Error occurred while fetching messages");
  }
}
