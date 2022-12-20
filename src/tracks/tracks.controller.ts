import {
    Body,
    Controller, Delete, Get,
    HttpException, HttpStatus, Param,
    Post, Put, Query,
    Request, UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";

import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {CreateTrackDto} from "./dto/create-track.dto";
import {TracksService} from "./tracks.service";
import {filesFilter} from "../files/filesFilter";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Track} from "./tracks.entity";
import {UpdateTrackDto} from "./dto/update-track.dto";

@ApiTags("tracks")
@Controller('api/tracks/')
export class TracksController {

    constructor(private tracksService: TracksService) {}

    @ApiOperation({summary: "Get All Tracks"})
    @ApiResponse({status: 200, type: [Track]})
    @ApiQuery({name: "offset", required: false, type: Number, description: "Offset for records"})
    @ApiQuery({name: "limit", required: false, type: Number, description: "Limit number of records"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllTracks(
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 0,
        @Request() req
    ) {
       return await this.tracksService.getAll(offset, limit, req.user)
    }

    @ApiOperation({summary: "Get My Tracks"})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get("my")
    async getMyTracks(@Request() req) {
       return req.user.tracks
    }

    @ApiOperation({summary: "Get Track By Id"})
    @ApiResponse({status: 200, type: Track})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getTrack(@Param("id") id: number, @Request() req) {
       return await this.tracksService.getTrackById(id, req.user)
    }

    @ApiOperation({summary: "Create Track"})
    @ApiResponse({status: 201, type: Track})
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
            {name: "music", maxCount: 1},
            {name: "image", maxCount: 1}
        ],
        {fileFilter: filesFilter}
    ))
    @ApiBody({type: CreateTrackDto, required: true})
    @Post()
    async createTrack(
        @UploadedFiles() files,
        @Body() dto: CreateTrackDto,
        @Request() req
    ) {
       const music_file = files.music ? files.music[0] : undefined
       const image_file = files.image ? files.image[0] : undefined
       return await this.tracksService.create(dto, req.user, music_file, image_file)
    }

    @ApiOperation({summary: "Upload Track Avatar"})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: { image: { type: 'string', format: 'binary' } },
          description: "Image for Track Avatar",
          nullable: false,
        }
    })
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image", {fileFilter: filesFilter}))
    @Post(":id/avatar")
    async uploadTrackAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Param("id") id: number,
        @Request() req
    ) {
       if (file) {
           return await this.tracksService.uploadTrackAvatar(id, file, req.user)
       }
       throw new HttpException("Image file not provided", HttpStatus.BAD_REQUEST)
    }

    @ApiOperation({summary: "Update Track"})
    @ApiResponse({status: 200, type: Track})
    @ApiBearerAuth()
    @ApiBody({type: UpdateTrackDto, required: true, description: "Options To Update Track"})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @Put(":id")
    async updateTrack(
        @Param("id") id: number,
        @Body() dto: UpdateTrackDto,
        @Request() req
    ) {
        console.log(req.user.id)
       return await this.tracksService.updateTrackById(id, dto, req.user)
    }

    @ApiOperation({summary: "Delete Track"})
    @ApiResponse({status: 204, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    async deleteTrack(
        @Param("id") id: number,
        @Request() req
    ) {
       return await this.tracksService.deleteTrackById(id, req.user)
    }

    @ApiOperation({summary: "Like Track"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @Post(":id/like")
    async likeTrack(
        @Param("id") id: number,
        @Request() req
    ) {
       return await this.tracksService.likeTrack(id, req.user)
    }

    @ApiOperation({summary: "Unlike Track"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @Post(":id/unlike")
    async unlikeTrack(
        @Param("id") id: number,
        @Request() req
    ) {
       return await this.tracksService.unlikeTrack(id, req.user)
    }

    @ApiOperation({summary: "Add Track Listening"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "Track Id"})
    @UseGuards(JwtAuthGuard)
    @Post(":id/listenings")
    async addTrackListening(
        @Param("id") id: number,
        @Request() req
    ) {
       return await this.tracksService.addTrackListening(id, req.user)
    }

}






