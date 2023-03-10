import { Exclude, Transform } from 'class-transformer'

import { Playlist } from '../playlist.entity'
import { User } from '../../users/users.entity'
import { ApiProperty } from '@nestjs/swagger'

export class PlaylistOutDto extends Playlist {
	@Exclude()
	usersLiked

	@Exclude()
	tracks

	@Transform(({obj}) => obj.id)
	owner: User

	@ApiProperty({
		example: 100,
		description: 'Playlist Likes Count',
	})
	likes?: number

	@ApiProperty({
		example: 'true',
		description: 'Is Request User Liked Obj',
	})
	isLikedByUser?: boolean
}
