import { APIResponse } from "@/helpers/APIResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User, getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
  const messageId = new mongoose.Types.ObjectId(params.messageid);
  await dbConnect();
  try {
    const session = await getServerSession(AuthOptions);
    const user: User = session?.user;
    if (!session || !user) return APIResponse(400, "Not authenticated");

    const findRes = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    
    if (findRes.modifiedCount == 0) return APIResponse(500, "Message Not Found or already deleted");

    return APIResponse(200, "Message deleted");
  } catch (error) {
    console.log("error: ", error);
    return APIResponse(500, "Error occurred while deleting message");
  }
}
