import { Exclude, Transform } from 'class-transformer'

import { User } from '../../users/users.entity'
import { Album } from '../albums.entity'

export class AlbumOutDto extends Album {
	@Exclude()
	usersLiked

	@Exclude()
	tracks

	@Transform(({ obj }) => obj.id)
	owner: User

	likes?: number

	isLikedByUser?: boolean
}
