import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { File } from './files.entity'
import { FilesService } from './files.service'

@Module({
	imports: [TypeOrmModule.forFeature([File]), ConfigModule],
	providers: [FilesService],
	exports: [FilesService],
})
export class FilesModule {}
