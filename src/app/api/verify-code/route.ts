import dbConnect from "@/lib/db";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, code } = await request.json();

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            },{ status: 404 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully",
            },{ status: 200 });

        } else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code is expired please sign up again to get new verification code",
            },{ status: 400 });

        }else{
            return Response.json({
                success: false,
                message: "Incorrect verification code",
            },{ status: 400 });
        }

    } catch (error) {
        console.error("User verifying error", error);
        return Response.json({
            success: false,
            message: "User Verifying error",
        },{ status: 500 });
    }
}
