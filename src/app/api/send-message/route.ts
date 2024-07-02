import UserModel from "@/model/User";
import { APIResponse } from "@/helpers/APIResponse";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) return APIResponse(400, "User not found");
    if (!user.isAcceptingMessages) return APIResponse(403, "User is not accepting the messages");

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);

    await user.save();

    return APIResponse(200, "Message sent successfully");
  } catch (error) {
    console.error("ADD_MESSAGE_ERROR :: ", error);
    return APIResponse(500, "Error occurred while adding message");
  }
}
