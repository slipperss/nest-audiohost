import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateTrackDto {
	@ApiProperty({
		required: true,
		description: 'Music File',
		type: 'string',
		format: 'binary',
	})
	readonly music: string

	@ApiProperty({
		required: false,
		description: 'Track Image File',
		type: 'string',
		format: 'binary',
	})
	readonly image: string

	@ApiProperty({
		required: true,
		example: 'Tsukuyomi',
		description: 'Track Title',
	})
	@IsString()
	@Length(4, 25, { message: 'Must be at least 4 and more than 25' })
	readonly title: string
}
