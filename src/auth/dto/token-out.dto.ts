import { ApiProperty } from '@nestjs/swagger'

export class TokenOutDto {
	@ApiProperty({ example: 'token', description: 'Access Token' })
	readonly access_token: string
}
