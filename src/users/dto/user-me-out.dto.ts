import { Exclude } from 'class-transformer'

import { User } from '../users.entity'

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

	@Exclude()
	isRegisteredWithGoogle

	@Exclude()
	roles
}
