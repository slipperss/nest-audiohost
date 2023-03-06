import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

import {InjectQueue} from "@nestjs/bull";
import { Queue } from "bull"

import {UsersService} from "../users/users.service";


@Injectable()
export class EmailConfirmationService {

    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        private configService: ConfigService,
        @InjectQueue("mail") private mailQueue: Queue,
    ) {}

    async checkEmailVerificationToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {algorithms: ["HS384"]})
            const user = await this.userService.getOne(
                {where: {id: payload.id},
                    select: {id: true, verified: true}
                })

            if (payload && user) {
                if (user.verified) {
                    return {result: "User already verified"}
                }
                await this.userService.update({id: user.id}, {verified: true})
                return {result: "Successfully verified"}
            }
        } catch(e) {
            throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST)
        }
    }

    async sendConfirmationEmail(id: number, email, username: string) {
        try {
            const payload = {email: email, id: id}
            const confirmationToken = this.jwtService.sign(payload)

            const mailJobData = {
                to: email,
                subject: 'Email Verification',
                from: process.env.EMAILS_FROM_EMAIL,
                html: `
                <h2>Hi! ${username} Thanks for choosing us, please click on the link below to verify your account</h2>
                <a href=${process.env.EMAIL_CONFIRMATION_URL}/${confirmationToken}><h2>Verify Account</h2></a>`
            }

            return await this.mailQueue.add(mailJobData, {})

        } catch (e) {
            throw new HttpException("Something went wrong while sending the email", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
