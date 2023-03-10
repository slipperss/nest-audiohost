import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { RolesModule } from './roles/roles.module'
import { AuthModule } from './auth/auth.module'
import { FilesModule } from './files/files.module'
import { dataSourceOptions } from './database/data-source'
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module'
import { GoogleAuthModule } from './google-auth/google-auth.module'
import { TracksModule } from './tracks/tracks.module'
import { PlaylistsModule } from './playlists/playlists.module'
import { AlbumsModule } from './albums/albums.module'
import { BullModule } from '@nestjs/bull'

@Module({
	imports: [
		ConfigModule.forRoot(),
		// ServeStaticModule.forRoot({
		// 	rootPath: path.resolve(__dirname, 'static'),
		// }),
		TypeOrmModule.forRoot(dataSourceOptions),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				redis: {
					host: configService.get('REDIS_HOST'),
					username: configService.get('REDIS_USERNAME'),
					password: configService.get('REDIS_PASSWORD'),
					port: parseInt(configService.get('REDIS_PORT')),
				},
			}),
		}),
		UsersModule,
		RolesModule,
		AuthModule,
		EmailConfirmationModule,
		FilesModule,
		GoogleAuthModule,
		TracksModule,
		PlaylistsModule,
		AlbumsModule,
	],
	controllers: [AppController],
	providers: [AppService],
	exports: [],
})
export class AppModule {}
