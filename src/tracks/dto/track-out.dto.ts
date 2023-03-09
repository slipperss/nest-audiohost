import { Track } from '../tracks.entity'
import { Exclude, Transform } from 'class-transformer'
import { User } from '../../users/users.entity'

export class TrackOutDto extends Track {
	@Exclude()
	usersLiked

	@Exclude()
	usersListened

	@Transform(({ obj }) => obj.id)
	author: User

	likes?: number

	listenings?: number

	isLikedByUser?: boolean
}
