import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";

export async function sendVerificationEmail({
    email,
    username,
    verifyCode,
}: { email: string; username: string; verifyCode: string }
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Mystery Message | Verification Email",
            react: VerificationEmail({ username, otp: verifyCode }) as React.ReactElement,
        });

        return { success: true, message: "Verification email sent"  };     

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
