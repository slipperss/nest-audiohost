import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Track } from '../tracks/tracks.entity'
import { User } from '../users/users.entity'

@Entity('playlists')
export class Playlist {
	constructor(partial: Partial<User>) {
		Object.assign(this, partial)
	}

	@ApiProperty({ example: '1', description: 'Unique Identifier' })
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({
		example: 'The best tracks of 2022',
		description: 'Track Title',
	})
	@Column({ length: 25, nullable: false, unique: false })
	title: string

	@ApiProperty({ example: true, description: 'Is Track Private For People' })
	@Column({ default: true })
	private: boolean

	@ApiProperty({
		example: '2022-11-16T11:48:27.112Z',
		description: 'Created Date',
	})
	@CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
	createdAt: Date

	@ApiProperty({
		example: '2022-11-16T11:49:11.571Z',
		description: 'Updated Date',
	})
	@UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
	updatedAt: Date

	@ApiProperty({ type: () => [Track], description: 'Tracks in Playlist' })
	@ManyToMany(() => Track, { eager: false })
	@JoinTable({
		name: 'playlist-tracks',
		joinColumn: { name: 'playlistId' },
		inverseJoinColumn: { name: 'trackId' },
	})
	tracks: Track[]

	@ApiProperty({ type: () => User, description: 'Playlist Owner' })
	@ManyToOne(() => User, (user) => user.playlists, { eager: false })
	owner: User

	@ApiProperty({ type: () => [User], description: 'Users Who Liked Playlist' })
	@ManyToMany(() => User, { eager: false })
	@JoinTable({ name: 'playlist-likes' })
	usersLiked: User[]
}
