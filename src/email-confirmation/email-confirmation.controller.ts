import {Controller, Get, HttpCode, Param, Request} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";

import {EmailConfirmationService} from "./email-confirmation.service";

@ApiTags("email-verification")
@Controller('api')
export class EmailConfirmationController {
    constructor(private emailConfirmationService: EmailConfirmationService) {
    }

    @ApiOperation({summary: "Verification Token from Email"})
    @ApiResponse({status: 200})
    @ApiParam({name: "token"})
    @Get("/email-verification/:token")
    emailVerification(@Param("token") token){
        return this.emailConfirmationService.checkEmailVerificationToken(token)
    }

    @ApiOperation({summary: "Send Verification Email Token "})
    @ApiResponse({status: 200})
    @Get("/send-email-verification/")
    sendEmailVerificationLink(@Request() req){
        const user = req.user
        return this.emailConfirmationService.sendConfirmationEmail(user.id, user.email, user.username)
    }
}
