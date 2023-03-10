import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'

export class CreatePlaylistDto {
	@ApiProperty({
		required: true,
		example: 'Top 5 Tracks of 2021',
		description: 'Playlist Title',
	})
	@IsString()
	@Length(4, 25, { message: 'Must be at least 4 and more than 25' })
	readonly title: string

	@ApiProperty({
		required: true,
		example: false,
		description: 'If Playlist Will Be Public Or Private For People',
	})
	@IsOptional()
	@IsBoolean()
	readonly private?: boolean
}
