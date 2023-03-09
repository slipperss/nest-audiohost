import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, IsOptional } from 'class-validator'

export class UpdateUserDto {
	// @ApiProperty({example: "example@gmail.com", description: "Email address"})
	// @IsOptional()
	// @IsString({message: "Must be a string"})
	// @IsEmail({}, {message: "Uncorrected email"})
	// readonly email: string
	@ApiProperty({
		required: true,
		example: 'megatron123',
		description: 'Username',
		nullable: false,
	})
	@IsString({ message: 'Must be a string' })
	@Length(4, 15, { message: 'Must be at least 4 and more than 16' })
	readonly username: string
	// @ApiProperty({example: "12345678", description: "Password"})
	// @IsOptional()
	// @IsString({message: "Must be a string"})
	// @Length(4, 16, {message: "Must be at least 4 and more than 16"})
	// password: string
	@ApiProperty({ example: 'new_avatar.jpg', description: 'Avatar' })
	@IsOptional()
	@IsString({ message: 'Must be a string' })
	avatar: string
}
