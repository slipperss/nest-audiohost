import { Exclude, Transform } from 'class-transformer'

import { User } from '../../users/users.entity'
import { Album } from '../albums.entity'
import { ApiProperty } from '@nestjs/swagger'

export class AlbumOutDto extends Album {
	@Exclude()
	usersLiked

	@Exclude()
	tracks

	@Transform(({ obj }) => obj.id)
	owner: User

	@ApiProperty({
		example: 100,
		description: 'Album Likes Count',
	})
	likes?: number

	@ApiProperty({
		example: 'true',
		description: 'Is Request User Liked Obj',
	})
	isLikedByUser?: boolean
}
