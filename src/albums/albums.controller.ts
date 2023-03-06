import {
    Body, ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Request, SerializeOptions,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AlbumsService} from "./albums.service";
import {Album} from "./albums.entity";
import {CreateAlbumDto} from "./dto/create-album.dto";
import {UpdateAlbumDto} from "./dto/update-album.dto";
import {AddTrackToAlbumDto} from "./dto/add-track-to-album.dto";
import {PlaylistOutDto} from "../playlists/dto/playlist-out.dto";
import {AlbumOutDto} from "./dto/album-out.dto";
import {TrackOutDto} from "../tracks/dto/track-out.dto";

@ApiTags("albums")
@Controller('api/albums/')
export class AlbumsController {

    constructor(private albumsService: AlbumsService) {}

    @ApiOperation({summary: "Create Album"})
    @ApiResponse({status: 201, type: AlbumOutDto})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Post()
    async createAlbum(@Body() dto: CreateAlbumDto, @Request() req) {
       return await this.albumsService.create(dto, req.user)
    }


    @ApiOperation({summary: "Get All Albums"})
    @ApiResponse({status: 201, type: [AlbumOutDto]})
    @ApiQuery({name: "offset", required: false, type: Number, description: "Offset for records"})
    @ApiQuery({name: "limit", required: false, type: Number, description: "Limit number of records"})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllAlbums(
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 0,
        @Request() req
    ) {
       return await this.albumsService.getAll(offset, limit, req.user)
    }

    @ApiOperation({summary: "Get Album By Id"})
    @ApiResponse({status: 200, type: AlbumOutDto})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getAlbumById(@Param("id") id: number, @Request() req) {
       return await this.albumsService.getAlbumById(id, req.user)
    }

    @ApiOperation({summary: "Get Album Tracks"})
    @ApiResponse({status: 201, type: [TrackOutDto]})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: TrackOutDto})
    @UseGuards(JwtAuthGuard)
    @Get(":id/tracks")
    async getAlbumTracks(
        @Param("id") id: number,
        @Request() req
    ) {
       return await this.albumsService.getAlbumTracks(id, req.user)
    }

    @ApiOperation({summary: "Get User Album"})
    @ApiResponse({status: 200, type: [AlbumOutDto]})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Get("my/all")
    async getUserAlbums(@Request() req) {
       return req.user.albums
    }

    @ApiOperation({summary: "Update Album"})
    @ApiResponse({status: 200, type: AlbumOutDto})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async updateAlbum(
        @Param("id") id: number,
        @Body() dto: UpdateAlbumDto,
        @Request() req
    ) {
       return await this.albumsService.updateAlbumById(id, dto, req.user)
    }

    @ApiOperation({summary: "Get Album By Id"})
    @ApiResponse({status: 204, schema: {example: {result: true}}})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteAlbum(@Param("id") id: number, @Request() req) {
       return await this.albumsService.deleteAlbumById(id, req.user)
    }

    @ApiOperation({summary: "Add Track To Album"})
    @ApiResponse({status: 204, type: AlbumOutDto})
    @ApiBody({type: AddTrackToAlbumDto, required: true})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Post(":id/add-track")
    async addTrackToAlbum(
        @Param("id") id: number,
        @Body() dto: AddTrackToAlbumDto,
        @Request() req
    ) {
       return await this.albumsService.addTrack(id, dto.trackId, req.user)
    }

    @ApiOperation({summary: "Remove Track From Album"})
    @ApiResponse({status: 204, type: AlbumOutDto})
    @ApiBody({type: AddTrackToAlbumDto, required: true})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: AlbumOutDto})
    @UseGuards(JwtAuthGuard)
    @Post(":id/remove-track")
    async removeTrackFromAlbum(
        @Param("id") id: number,
        @Body() dto: AddTrackToAlbumDto,
        @Request() req
    ) {
        return await this.albumsService.removeTrack(id, dto.trackId, req.user)
    }

    @ApiOperation({summary: "Copy Album To User Albums"})
    @ApiResponse({status: 204, type: PlaylistOutDto})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({type: PlaylistOutDto})
    @UseGuards(JwtAuthGuard)
    @Post(":id/copy-to-my-playlists")
    async copyAlbumToUserAlbums(@Param("id") id: number, @Request() req) {
        return await this.albumsService.copyAlbumToUserPlaylists(id, req.user)
    }
    
    @ApiOperation({summary: "Like Album"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/like")
    async likeAlbum(@Param("id") id: number, @Request() req) {
        await this.albumsService.likeAlbum(id, req.user)
        return {result: true}
    }

    @ApiOperation({summary: "Unlike Album"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Album Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(":id/unlike")
    async unlikeAlbum(@Param("id") id: number, @Request() req) {
        await this.albumsService.unlikeAlbum(id, req.user)
        return {result: true}
    }

}
