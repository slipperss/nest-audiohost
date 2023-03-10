import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

import { config } from 'aws-sdk'

import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'

async function bootstrap() {
	const PORT = process.env.PORT || 8000

	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)

	const swaggerConfig = new DocumentBuilder()
		.setTitle('AMAZING PROJECT')
		.setVersion('1.0.0')
		.build()

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup('/docs', app, swaggerDocument)

	config.update({
		accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
		secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
		region: configService.get('AWS_REGION'),
	})

	app.enableCors()
	app.useGlobalPipes(new ValidationPipe())
	app.use(cookieParser())

	await app.listen(PORT, () => {
		console.log(`Server started on ${PORT} port`)
	})
}

bootstrap()
