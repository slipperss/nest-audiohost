import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'

import { EmailConfirmationService } from './email-confirmation.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('email-verification')
@Controller('api')
export class EmailConfirmationController {
	constructor(private emailConfirmationService: EmailConfirmationService) {}

	@ApiOperation({ summary: 'Verification Token from Email' })
	@ApiResponse({ status: 200 })
	@ApiParam({ name: 'token' })
	@Get('/email-verification/:token')
	emailVerification(@Param('token') token) {
		return this.emailConfirmationService.checkEmailVerificationToken(token)
	}

	@ApiOperation({ summary: 'Send Verification Email Token ' })
	@ApiResponse({ status: 200 })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get('/send-email-verification/')
	async sendEmailVerificationLink(@Request() req) {
		const user = req.user
		await this.emailConfirmationService.sendConfirmationEmail(
			user.id,
			user.email,
			user.username,
		)
		return { result: `Verification email has been sent to ${user.email}` }
	}
}
