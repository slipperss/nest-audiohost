import { Injectable } from '@nestjs/common'
import * as uuid from 'uuid'
import { ConfigService } from '@nestjs/config'
import { S3 } from 'aws-sdk'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { File } from './files.entity'

@Injectable()
export class FilesService {
	constructor(
		private configService: ConfigService,
		@InjectRepository(File) private filesRepository: Repository<File>,
	) {}

	async uploadFile(dataBuffer: Buffer) {
		const s3 = new S3()

		const uploadResult = await s3
			.upload({
				Bucket: this.configService.get('AWS_BUCKET_NAME'),
				Body: dataBuffer,
				Key: uuid.v4(),
			})
			.promise()
		const newFile = await this.filesRepository.create({
			key: uploadResult.Key,
			url: uploadResult.Location,
		})

		return newFile
	}

	async deleteFile(file: File) {
		const s3 = new S3()
		await s3
			.deleteObject({
				Bucket: this.configService.get('AWS_BUCKET_NAME'),
				Key: file.key,
			})
			.promise()
		return await this.filesRepository.delete(file.id)
	}
}
