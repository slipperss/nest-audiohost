import { Exclude } from 'class-transformer'

import { UserMeOutDto } from './user-me-out.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UserByIdOutDto extends UserMeOutDto {
	@Exclude()
	playlists

	@ApiProperty({
		example: 'true',
		description: 'Is Request User Followed On User',
	})
	isFollowedByUser?: boolean
}
