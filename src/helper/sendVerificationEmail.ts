import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

export async function sendVerificationEmail({
    email,
    username,
    verifyCode,
}: { email: string; username: string; verifyCode: string }
): Promise<ApiResponse> {
    try {

        const htmlElement = await render(VerificationEmail({ username, otp: verifyCode }) as React.ReactElement);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PW,
            }
        })    

        const mailOptions = {
            from: `"Mystery Message" ${process.env.NODEMAILER_EMAIL}`,
            to: email,
            subject: 'Mystery Message | Verification Code',
            html: htmlElement,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Verification email sent successfully" };

    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
