import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";

import {Album} from "./albums.entity";
import {TracksService} from "../tracks/tracks.service";
import {User} from "../users/users.entity";
import {CreateAlbumDto} from "./dto/create-album.dto";
import {PlaylistsService} from "../playlists/playlists.service";
import {CheckObjOwnerOrAdmin} from "../permissions/obj-owner-or-admin";
import {UpdateAlbumDto} from "./dto/update-album.dto";




@Injectable()
export class AlbumsService {

    constructor(
        @InjectRepository(Album) private albumRepository: Repository<Album>,
        private trackService: TracksService,
        private playlistService: PlaylistsService,
    ) {}

    async create(dto: CreateAlbumDto, user: User){
        const album = this.albumRepository.create({...dto, owner: user})
        await this.albumRepository.save(album)
        return await this.getAlbumById(album.id, user)
    }

    async getAll(offset: number, limit: number) {
        const albums = await this.albumRepository.find({
            skip: offset,
            take: limit,
            relations: {owner: true},
            order: {createdAt: "DESC"}
        })
        return [{count: albums.length}, albums]
    }

    async getAlbumById(id: number, req_user: User) {
        const album = await this.albumRepository.findOne({
            where: {id: id},
            relations: {owner: true, tracks: true, usersLiked: true},
        })
        if (!album) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }
        return {
            id: album.id,
            title: album.title,
            createdAt: album.createdAt,
            owner: album.owner,
            tracks: album.tracks,
            likes: album.usersLiked.length,
            isLikedByUser: req_user.likedAlbums.some(value => value.id === album.id)
        }
    }

    async getOne(options: FindOneOptions<Album>) {
        return await this.albumRepository.findOne(options)
    }

    async updateAlbumById(id: number, dto: UpdateAlbumDto, req_user: User) {
        const album = await this.albumRepository.findOneBy({id: id}) // Only for exception in this case
        if(!album) {
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(album.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.update({id: album.id}, dto)
    }

     async update(criteria: FindOptionsWhere<Album>, partialEntity: QueryDeepPartialEntity<Album>): Promise<Album>
    {
        try {
            await this.albumRepository.update(criteria, partialEntity)
            return await this.albumRepository.findOneBy(criteria)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteAlbumById(id: number, req_user: User) {
        const album = await this.getOne({where: {id: id}})
        if(!album) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)

        if(!CheckObjOwnerOrAdmin(album.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        return await this.delete(id)
    }

    async delete(id: number) {
        await this.albumRepository.delete(id)
        return {result: true}
    }

    async addTrack(album_id: number, track_id: number, req_user: User): Promise<Album> {
        const album = await this.getOne({where: {id: album_id}, relations: {tracks: true}})

        const track = await this.trackService.getOne({where: {id: track_id}})

        if(!album || !track) {
            throw new HttpException("No album or track with this id's found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(album.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        if (!album.tracks.some(value => value.id === track.id)) {

            album.tracks.push(track)
            await this.albumRepository.save(album)
        }

        return album
    }

    async removeTrack(album_id: number, track_id: number, req_user: User): Promise<Album> {
        const album = await this.getOne({where: {id: album_id}, relations: {tracks: true}})

        const track = await this.trackService.getOne({where: {id: track_id}})

        if(!album || !track) {
            throw new HttpException("No album or track with this id's found", HttpStatus.NOT_FOUND)
        }

        if(!CheckObjOwnerOrAdmin(album.id, req_user)) {
            throw new HttpException("Forbidden", HttpStatus.FORBIDDEN)
        }

        if (album.tracks.some(value => value.id === track.id)) {

            album.tracks = album.tracks.filter(value => value.id !== track.id)
            await this.albumRepository.save(album)
        }

        return album
    }

    async copyAlbumToUserPlaylists(id: number, user: User) {
        const album = await this.getOne({where: {id: id}, relations: {tracks: true}})

        if(!album) {
            throw new HttpException("Album was not found", HttpStatus.NOT_FOUND)
        }

        let newPlaylist = await this.playlistService.create({title: album.title, private: false}, user)

        newPlaylist = await this.playlistService.getOne({
            where: {id: newPlaylist.id},
            relations: {tracks: true, owner: true}
        })

        newPlaylist.tracks = album.tracks

        console.log(newPlaylist)

        await this.albumRepository.manager.save(newPlaylist)

        return newPlaylist
    }

   async likeAlbum(id: number, user: User) {
        const album = await this.getOne({where: {id:id}, relations: {owner: true, usersLiked: true}})

        if(!album) {
            throw new HttpException("Album was not found", HttpStatus.NOT_FOUND)
        }

        if (album.owner.id === user.id) {
            throw new HttpException("You can't like your album", HttpStatus.BAD_REQUEST)
        }

        if(!user.likedAlbums.some(likedAlbum => likedAlbum.id === album.id)) {

            user.likedAlbums.push(album)
            await this.albumRepository.manager.save(user)
        }

        return {result: true}
    }

     async unlikeAlbum(id: number, user: User) {
        const album = await this.getOne({where: {id: id}, relations: {usersLiked: true, owner: true}})

        if(!album) {
            throw new HttpException("Album was not found", HttpStatus.NOT_FOUND)
        }

        if (album.owner.id === user.id) {
            throw new HttpException("You can't unlike your Album", HttpStatus.BAD_REQUEST)
        }

        if(user.likedAlbums.some(likedAlbum => likedAlbum.id === album.id)) {

            user.likedAlbums = user.likedAlbums.filter(value => value.id !== album.id)
            await this.albumRepository.manager.save(user)
        }

        return {result: true}
    }


}
