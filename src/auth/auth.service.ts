import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import { User } from '../users/users.entity'
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service'
import { ConfigService } from '@nestjs/config'
import { JwtAccessTokenPayload } from './interfaces/accessTokenPayload'

@Injectable()
export class AuthService {
	constructor(
		private userService: UsersService,
		private jwtService: JwtService,
		private emailConfirmationService: EmailConfirmationService,
		private configService: ConfigService,
	) {}

	async registration(userDto: CreateUserDto) {
		const existing = await this.userService.getOne({
			where: { email: userDto.email },
		})
		if (existing) {
			throw new HttpException('User is already exist!', HttpStatus.BAD_REQUEST)
		}
		userDto.password = await bcrypt.hash(userDto.password, 5)
		const user = await this.userService.createUser(userDto)

		await this.emailConfirmationService.sendConfirmationEmail(
			user.id,
			user.email,
			user.username,
		)
	}

	async validateUser(email: string, password: string): Promise<User> {
		const user = await this.userService.getOne({
			where: { email: email },
			select: { password: true, email: true, username: true, id: true },
		})
		if (user) {
			const passwordEquals = await bcrypt.compare(password, user.password)
			if (passwordEquals) {
				return user
			}
		}
		return null
	}

	public getCookieWithJwtAccessToken(tokenPayload: JwtAccessTokenPayload) {
		const token = this.jwtService.sign(tokenPayload, {
			expiresIn: `${this.configService.get(
				'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
			)}s`,
		})
		return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
			'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
		)}`
	}
	public getCookieForLogOut() {
		return `Authorization=; HttpOnly; Path=/; Max-Age=0`
	}
}
