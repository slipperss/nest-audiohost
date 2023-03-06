import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm"
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

import * as path from "path";
import * as fs from "fs"

import {FilesService} from "../files/files.service";
import {Track} from "./tracks.entity";
import {CreateTrackDto} from "./dto/create-track.dto";
import {User} from "../users/users.entity";
import {CheckObjOwnerOrAdmin} from "../permissions/obj-owner-or-admin";
import {UpdateTrackDto} from "./dto/update-track.dto";


@Injectable()
export class TracksService {

    constructor(
        @InjectRepository(Track) private tracksRepository: Repository<Track>,
        private fileService: FilesService,
    ) {}

    async create(
        dto: CreateTrackDto,
        user: User,
        music_file: Express.Multer.File,
        image_file: Express.Multer.File
    ): Promise<Track> {
        if (music_file) {
            const musicFilePath = path.resolve(__dirname, "..", "static/tracks")
            const musicFileName = "tracks/" + await this.fileService.createFile(music_file, musicFilePath)

            const track = this.tracksRepository.create({
                title: dto.title,
                file: musicFileName,
                author: user,
            })

            if (image_file) {
                const imageFilePath = path.resolve(__dirname, "..", "static/track-avatars")
                const imageFileName = "track-avatars/" + await this.fileService.createFile(image_file, imageFilePath)
                track.image = imageFileName
            }
            await this.tracksRepository.save(track)

            return await this.getOne({where: {id:track.id}, relations: {author: true}})
        }
        throw new HttpException("Music file not provided", HttpStatus.BAD_REQUEST)
    }

    async getAll(offset: number, limit: number = 10, user: User) {
        try {
                const result = []
            const tracks = await this.tracksRepository.find({
                skip: offset,
                take: limit,
                relations: {author: true, usersLiked: true, usersListened: true},
                order: {createdAt: "DESC"},
            })

            tracks.length ? tracks.forEach(track => {
                result.push({
                    ...track,
                    likes: track.usersLiked.length,
                    listenings: track.usersListened.length,
                    isLikedByUser: user.likedTracks.some(likedTrack => likedTrack.id === track.id)
                })
            }) : []

            return [{count: result.length}, result]
        } catch (e) {
            return e
        }
    }

    async getOne(options: FindOneOptions<Track>) {
        return await this.tracksRepository.findOne(options)
    }

    async getTrackById(id: number, req_user: User) {
        const track = await this.getOne({
            where: {id: id},
            relations: {author: true, usersListened: true, usersLiked: true}
        })

        if(!track) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)

        return {
            ...track,
            likes: track.usersLiked.length,
            listenings: track.usersListened.length,
            isLikedByUser: req_user.likedTracks.some(value => value.id === track.id)
        }
    }

    async updateTrackById(id: number, dto: UpdateTrackDto, req_user: User) {
        const track = await this.getOne({where: {id: id}, relations: {author: true}})

        if(!track) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(track.author.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.update({id: track.id}, dto)
    }


    async update(criteria: FindOptionsWhere<Track>, partialEntity: QueryDeepPartialEntity<Track>): Promise<Track>
    {
        try {
            await this.tracksRepository.update(criteria, partialEntity)
            return await this.tracksRepository.findOneBy(criteria)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
        }
    }

    async uploadTrackAvatar(
        track_id: number,
        image_file: Express.Multer.File,
        req_user: User
    ): Promise<Track> {
        const track = await this.getOne({where: {id: track_id}, relations: {author: true}})

        if (!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(track.author.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        const imageFilePath = path.resolve(__dirname, "..", "static/track-avatars")
        const imageFileName = "track-avatars/" + await this.fileService.createFile(image_file, imageFilePath)

        // Delete previous track avatar image
        const prevFilePath = path.resolve(__dirname, "..", "static/" + track.image)
        fs.rm(prevFilePath, () => {})

        track.image = imageFileName

        return await this.tracksRepository.save(track)
    }

    async deleteTrackById(id: number, req_user: User) {
        const track = await this.getOne({where: {id: id}, relations: {author: true}})
        if(!track) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)

        if(!CheckObjOwnerOrAdmin(track.author.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.delete(id)
    }

    async delete(id: number): Promise<any> {
        const track = await this.getOne({where: {id: id}})

        //Deleting track image file and music file from storage
        const imageFilePath = path.resolve(__dirname, "..", "static/" + track.image)
        fs.rm(imageFilePath, () => {})

        const musicFilePath = path.resolve(__dirname, "..", "static/" + track.file)
        fs.rm(musicFilePath, () => {})

        await this.tracksRepository.delete(id)

        return {result: true}
    }

    async likeTrack(id: number, user: User) {
        const track = await this.tracksRepository.findOne({where: {id}, relations: {usersLiked: true}})
        if (!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND)
        }

        if (track.author.id === user.id) {
            throw new HttpException("You can't like your track", HttpStatus.BAD_REQUEST)
        }

        // Check if user already listened this track
        if(!user.likedTracks.some(likedTrack => likedTrack.id === track.id)) {
            user.likedTracks.push(track)
            await this.tracksRepository.manager.save(user)
        }
    }

    async unlikeTrack(id: number, user: User) {
        const track = await this.tracksRepository.findOne({where: {id}, relations: {usersLiked: true}})
        if (!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND)
        }

        if (track.author.id === user.id) {
            throw new HttpException("You can't unlike your track", HttpStatus.BAD_REQUEST)
        }

        // Check if user already unliked this track
        if(user.likedTracks.some(likedTrack => likedTrack.id === track.id)) {
            user.likedTracks = user.likedTracks.filter(value => value.id !== track.id)
            await this.tracksRepository.manager.save(user)
        }
    }


    async addTrackListening(id: number, user: User) {
        const track = await this.tracksRepository.findOne({where: {id}, relations: {usersListened: true}})
        if (!track) {
            throw new HttpException("Track Not Found", HttpStatus.NOT_FOUND)
        }

        // Check if user already listened this track
        if(!user.listenedTracks.some(listenedTrack => listenedTrack.id === track.id)) {
            user.listenedTracks.push(track)
            await this.tracksRepository.manager.save(user)
        }
    }

}


