import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import dbConnect from "@/lib/db";
import { User } from "next-auth";


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    
        const user: User = session?.user as User;
    
        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not Authenticated",
                },
                { status: 401 }
            );
        }
    
        const userId = user._id;

        try {
            
        } catch (error) {
            
        }
}