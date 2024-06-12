import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const body = await req.json();
    const {email, subject, message} = body;
    const { SMTP_EMAIL, SMTP_PASS } = process.env;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASS,
        },
    });

    try {
        const mail = await transporter.sendMail({
            from: SMTP_EMAIL,
            to: email,
            subject: subject,
            html: message,
        });

        return NextResponse.json({ status: 200, message: "Success: email was sent" });
    } catch (error) {
        return NextResponse.json({ status: 500, message: "COULD NOT SEND MESSAGE" });
    }
}
