import dotenv from "dotenv";
dotenv.config({path:"./config.env"});
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});
