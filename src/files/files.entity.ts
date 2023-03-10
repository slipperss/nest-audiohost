import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('files')
export class File {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false, unique: true })
	key: string

	@Column({ nullable: false, unique: true })
	url: string
}
