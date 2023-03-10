import { ApiProperty } from '@nestjs/swagger'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { User } from '../users/users.entity'
import { File } from '../files/files.entity'

@Entity('tracks')
export class Track {
	constructor(partial: Partial<User>) {
		Object.assign(this, partial)
	}

	@ApiProperty({ example: '1', description: 'Unique Identifier' })
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ example: 'New Vacancies', description: 'Track Title' })
	@Column({ length: 25, nullable: false, unique: true })
	title: string

	@ApiProperty({ example: 'image.jpg', description: 'Track Preview Image' })
	@OneToOne(() => File, { eager: true })
	@JoinColumn()
	image: File

	@ApiProperty({ example: 'file.mp4', description: 'Track File' })
	@OneToOne(() => File, { eager: true })
	@JoinColumn()
	audio: File

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

	@ApiProperty({ type: () => User, description: 'Track Author' })
	@ManyToOne(() => User, (user) => user.tracks, { eager: false })
	author: User

	@ApiProperty({ type: () => [User], description: 'User Who Liked This Track' })
	@ManyToMany(() => User, { eager: false })
	@JoinTable({ name: 'track-likes' })
	usersLiked: User[]

	@ApiProperty({
		type: () => [User],
		description: 'User Who Listened This Track',
	})
	@ManyToMany(() => User, { eager: false })
	@JoinTable({ name: 'track-listenings' })
	usersListened: User[]
}
