import { ApiProperty } from '@nestjs/swagger'

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('roles')
export class Role {
	@ApiProperty({ example: '1', description: 'Unique Identifier' })
	@PrimaryGeneratedColumn()
	id: number

	@ApiProperty({ example: 'admin', description: 'Role Value' })
	@Column({ length: 500, unique: true })
	value: string

	@ApiProperty({
		example: 'Administrator Rights',
		description: 'Role Description',
	})
	@Column('text')
	description: string
}
