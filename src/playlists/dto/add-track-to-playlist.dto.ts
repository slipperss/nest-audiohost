import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class AddTrackToPlaylistDto {
	@ApiProperty({ required: true, example: 2, description: 'Track Id' })
	@IsNumber()
	readonly trackId: number
}
