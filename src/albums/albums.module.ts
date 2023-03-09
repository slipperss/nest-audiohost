import { Module } from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Album } from "./albums.entity";
import { AlbumsController } from "./albums.controller";
import { TracksModule } from "../tracks/tracks.module";
import { PlaylistsModule } from "../playlists/playlists.module";

@Module({
  imports: [TypeOrmModule.forFeature([Album]), TracksModule, PlaylistsModule],
  providers: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
