import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";

import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {User} from "../users/users.entity";
import {Playlist} from "./playlist.entity";
import {DeleteResult, Repository} from "typeorm";
import {TracksService} from "../tracks/tracks.service";
import {UpdatePlaylistDto} from "./dto/update-playlist.dto";
import {CheckObjOwnerOrAdmin} from "../permissions/obj-owner-or-admin";

@Injectable()
export class PlaylistsService {

    constructor(
        @InjectRepository(Playlist) private playlistRepository: Repository<Playlist>,
        private trackService: TracksService
    ) {
    }

    async create(dto: CreatePlaylistDto, user: User) {
        let playlist = this.playlistRepository.create({...dto, owner: user})
        return await this.playlistRepository.save(playlist)
    }

    async getAll(offset: number, limit: number) {
        const playlists = await this.playlistRepository.find({
            skip: offset,
            take: limit,
            where: {private: false},
            order: {createdAt: "DESC"}
        })
        return [{count: playlists.length}, playlists]
    }


    async getOne(options: FindOneOptions<Playlist>) {
        return await this.playlistRepository.findOne(options)
    }

    async getPlaylistById(id: number, req_user: User) {
        const playlist = await this.getOne({
            where: {id: id},
            relations: {tracks: true, owner: true, usersLiked: true},
        })

        if (!playlist || (playlist.private && playlist.owner.id !== req_user.id)) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }

        return {
            id: playlist.id,
            title: playlist.title,
            createdAt: playlist.createdAt,
            updatedAt: playlist.updatedAt,
            owner: playlist.owner,
            likes: playlist.usersLiked.length,
            isLikedByUser: req_user.likedPlaylists.some(value => value.id === playlist.id)
        }
    }

    async getById(id: number) {
        return await this.playlistRepository.findOne({where:{id}, relations: {tracks: true, usersLiked: true}})
    }

    async updatePlaylistById(id: number, dto: UpdatePlaylistDto, req_user: User) {
        const playlist = await this.playlistRepository.findOneBy({id: id}) // Only for exception in this case
        if(!playlist) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(playlist.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.update({id: playlist.id}, dto)
    }

     async update(criteria: FindOptionsWhere<Playlist>, partialEntity: QueryDeepPartialEntity<Playlist>): Promise<Playlist>
    {
        try {
            await this.playlistRepository.update(criteria, partialEntity)

            return await this.playlistRepository.findOneBy(criteria)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
        }
    }

    async deletePlaylistById(id: number, req_user: User) {
        const playlist = await this.getOne({where: {id: id}})
        if(!playlist) {
            throw new HttpException("Playlist was not found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(playlist.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.delete(id)
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.playlistRepository.delete(id)
    }

    async addTrack(playlist_id: number, track_id: number, req_user: User): Promise<Playlist> {
        const playlist = await this.getOne({where: {id: playlist_id}, relations: {tracks: true}})

        const track = await this.trackService.getOne({where: {id: track_id}})

        if(!playlist || !track) {
            throw new HttpException("No playlist or track with this id's found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(playlist.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        if (!playlist.tracks.some(value => value.id === track.id)) {

            playlist.tracks.push(track)
            await this.playlistRepository.save(playlist)
        }

        return playlist
    }

    async removeTrack(playlist_id: number, track_id: number, req_user: User): Promise<Playlist> {
        const playlist = await this.getOne({where: {id: playlist_id}, relations: {tracks: true}})

        const track = await this.trackService.getOne({where: {id: track_id}})

        if(!playlist || !track) {
            throw new HttpException("No playlist or track with this id's found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(playlist.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        if (playlist.tracks.some(value => value.id === track.id)) {

            playlist.tracks = playlist.tracks.filter(value => value.id !== track.id)
            await this.playlistRepository.save(playlist)
        }

        return playlist
    }

    async copyPlaylistToUserPlaylists(id: number, user: User) {
        const playlist = await this.getOne({where: {id: id}, relations: {tracks: true, owner: true}})

        if (!playlist || (playlist.private && playlist.owner.id !== user.id)) {
            throw new HttpException("Playlist was not found", HttpStatus.NOT_FOUND)
        }

        if(playlist.owner.id === user.id) {
            throw new HttpException("You are already have this playlist", HttpStatus.BAD_REQUEST)
        }

        let newPlaylist = this.playlistRepository.create(
            {
                title: playlist.title,
                private: false,
                owner: user,
                tracks: playlist.tracks
            }
        )

        await this.playlistRepository.save(newPlaylist)

        return await this.getOne({where: {id:newPlaylist.id}, relations: {owner: true}})
    }

    async likePlaylist(id: number, user: User) {
        const playlist = await this.getOne({where: {id:id}, relations: {owner: true, usersLiked: true}})

        if(!playlist || playlist.private) {
            throw new HttpException("Playlist was not found", HttpStatus.NOT_FOUND)
        }

        if (playlist.owner.id === user.id) {
            throw new HttpException("You can't like your playlist", HttpStatus.BAD_REQUEST)
        }

        if(!user.likedPlaylists.some(likedPlaylist => likedPlaylist.id === playlist.id)) {

            user.likedPlaylists.push(playlist)
            await this.playlistRepository.manager.save(user)
        }

        return {result: true}
    }

     async unlikePlaylist(id: number, user: User) {
        const playlist = await this.getOne({where: {id: id}, relations: {usersLiked: true, owner: true}})

        if(!playlist || playlist.private) {
            throw new HttpException("Playlist was not found", HttpStatus.NOT_FOUND)
        }

        if (playlist.owner.id === user.id) {
            throw new HttpException("You can't unlike your playlist", HttpStatus.BAD_REQUEST)
        }

        if(user.likedPlaylists.some(likedPlaylist => likedPlaylist.id === playlist.id)) {

            user.likedPlaylists = user.likedPlaylists.filter(value => value.id !== playlist.id)
            await this.playlistRepository.manager.save(user)
        }

        return {result: true}
    }

}
