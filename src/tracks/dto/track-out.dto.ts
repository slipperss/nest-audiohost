import { Track } from '../tracks.entity'
import { Exclude, Transform } from 'class-transformer'
import { User } from '../../users/users.entity'
import { File } from '../../files/files.entity'
import { ApiProperty } from '@nestjs/swagger'

export class TrackOutDto extends Track {
	@Exclude()
	usersLiked

	@Exclude()
	usersListened

	@Transform(({ obj }) => obj.id)
	author: User

	@ApiProperty({
		example: 100,
		description: 'Track Likes Count',
	})
	likes?: number

	@Transform(({ obj }) => obj.url)
	file: File

	@Transform(({ obj }) => obj.url)
	image: File

	@ApiProperty({
		example: 100,
		description: 'Track Listenings Count',
	})
	listenings?: number

	@ApiProperty({
		example: 'true',
		description: 'Is Request User Liked Obj',
	})
	isLikedByUser?: boolean
}
