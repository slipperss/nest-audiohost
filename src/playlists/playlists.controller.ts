import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Response, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {PlaylistsService} from "./playlists.service";
import {Playlist} from "./playlist.entity";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {DeleteResult} from "typeorm";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";
import {AddTrackToPlaylistDto} from "./dto/add-track-to-playlist.dto";

@ApiTags("playlists")
@Controller('api/playlists/')
export class PlaylistsController {

    constructor(private playlistService: PlaylistsService) {}

    @ApiOperation({summary: "Create Playlist"})
    @ApiResponse({status: 201, type: Playlist})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    async createPlaylist(
        @Body() dto: CreatePlaylistDto,
        @Request() req
    ) {
       return await this.playlistService.create(dto, req.user)
    }


    @ApiOperation({summary: "Get All Public Playlists"})
    @ApiResponse({status: 201, type: [Playlist]})
    @ApiQuery({name: "offset", required: false, type: Number, description: "Offset for records"})
    @ApiQuery({name: "limit", required: false, type: Number, description: "Limit number of records"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllPublicPlaylists(
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 0,
    ) {
       return await this.playlistService.getAll(offset, limit)
    }

    @ApiOperation({summary: "Get Playlist By Id"})
    @ApiResponse({status: 200, type: Playlist})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getPlaylistById(@Param("id") id: number, @Request() req) {
       return await this.playlistService.getPlaylistById(id, req.user)
    }

    @ApiOperation({summary: "Get User Playlist"})
    @ApiResponse({status: 200, type: [Playlist]})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("my/all")
    async getUserPlaylists(@Request() req) {
       return req.user.playlists
    }

    @ApiOperation({summary: "Update Playlist"})
    @ApiResponse({status: 200, type: Playlist})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async updatePlaylist(
        @Param("id") id: number,
        @Body() dto: UpdatePlaylistDto,
        @Request() req
    ) {
       return await this.playlistService.updatePlaylistById(id, dto, req.user)
    }

    @ApiOperation({summary: "Get Playlist By Id"})
    @ApiResponse({status: 204, type: DeleteResult})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deletePlaylist(@Param("id") id: number, @Request() req) {
       return await this.playlistService.deletePlaylistById(id, req.user)
    }

    @ApiOperation({summary: "Add Track To Playlist"})
    @ApiResponse({status: 204, type: Playlist})
    @ApiBody({type: AddTrackToPlaylistDto, required: true})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/add-track")
    async addTrackToPlaylist(
        @Param("id") id: number,
        @Body() dto: AddTrackToPlaylistDto,
        @Request() req
    ) {
       return await this.playlistService.addTrack(id, dto.trackId, req.user)
    }

    @ApiOperation({summary: "Remove Track From Playlist"})
    @ApiResponse({status: 204, type: Playlist})
    @ApiBody({type: AddTrackToPlaylistDto, required: true})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/remove-track")
    async removeTrackFromPlaylist(
        @Param("id") id: number,
        @Body() dto: AddTrackToPlaylistDto,
        @Request() req
    ) {
        return await this.playlistService.removeTrack(id, dto.trackId, req.user)
    }

    @ApiOperation({summary: "Copy Playlist To User Playlists"})
    @ApiResponse({status: 204, type: Playlist})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/copy-to-my-playlists")
    async copyPlaylistToUserPlaylists(@Param("id") id: number, @Request() req) {
        return await this.playlistService.copyPlaylistToUserPlaylists(id, req.user)
    }

    @ApiOperation({summary: "Like Playlist"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/like")
    async likePlaylist(@Param("id") id: number, @Request() req) {
        return await this.playlistService.likePlaylist(id, req.user)
    }

    @ApiOperation({summary: "Unlike Playlist"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Playlist Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/unlike")
    async unlikePlaylist(@Param("id") id: number, @Request() req) {
        return await this.playlistService.unlikePlaylist(id, req.user)
    }


}
