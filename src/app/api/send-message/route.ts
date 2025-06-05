import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // if user accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMsg = { content, createdAt: new Date() };
    user.messages.push(newMsg as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent succesfully!",
      },
      {
        status: 404,
      }
    );
  } catch (error) {
    console.log("Error adding messages", error);
    return Response.json(
      {
        success: false,
        message: "internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
