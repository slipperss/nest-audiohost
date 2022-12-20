import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import {TypeOrmModule} from '@nestjs/typeorm'
import * as path from "path"

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import {dataSourceOptions} from "./database/data-source";
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { TracksModule } from './tracks/tracks.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { AlbumsModule } from './albums/albums.module';



@Module({
  imports: [
      ConfigModule.forRoot(),//{envFilePath: `.${process.env.NODE_ENV}.env`}),
      ServeStaticModule.forRoot({
        rootPath: path.resolve(__dirname, "static"),
      }),
      TypeOrmModule.forRoot(dataSourceOptions),
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
  exports: []
})
export class AppModule {}
