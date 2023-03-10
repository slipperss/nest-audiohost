import { Exclude, Transform } from 'class-transformer'

import { User } from '../users.entity'
import { File } from '../../files/files.entity'

export class UserMeOutDto extends User {
	@Exclude()
	banned

	@Exclude()
	banReason

	@Exclude()
	verified

	@Exclude()
	likedPlaylists

	@Exclude()
	likedTracks

	@Exclude()
	likedAlbums

	@Exclude()
	listenedTracks

	@Transform(({ obj }) => obj.url)
	avatar: File

	@Exclude()
	isRegisteredWithGoogle

	@Exclude()
	roles
}
