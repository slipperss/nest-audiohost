import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import {TypeOrmModule} from "@nestjs/typeorm";

import {Playlist} from "./playlist.entity";
import {TracksModule} from "../tracks/tracks.module";

@Module({
  imports: [
      TracksModule,
      TypeOrmModule.forFeature([Playlist])
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController],
  exports: [PlaylistsService]
})
export class PlaylistsModule {}
