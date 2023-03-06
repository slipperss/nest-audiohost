import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as bcrypt from "bcryptjs"
import * as path from "path";
import * as fs from "fs"

import {User} from "./users.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {FilesService} from "../files/files.service";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
        private roleService:  RolesService,
        private fileService: FilesService
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(dto)
        const role = await this.roleService.getRoleByValue("user")
        if (!role) throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR)
        user.roles = [role]
        return await this.usersRepository.save(user)
    }

    async createWithGoogle(email: string, username: string) {
        const newUser = this.usersRepository.create({
          email,
          username,
          isRegisteredWithGoogle: true,
          verified: true,
        });
        await this.usersRepository.save(newUser);
        return await this.getOne({where: {email: email}, select: {id: true, isRegisteredWithGoogle: true}});
    }

    async getAllUsers(offset: number, limit: number): Promise<any> {
        try {
            const users = await this.usersRepository.find({
                relations: {roles: true},
                skip: offset,
                take: limit,
            })
            return [{count: users.length}, users]
        } catch (e) {
            return e
        }
    }

    async update(criteria: FindOptionsWhere<User>, partialEntity: QueryDeepPartialEntity<User>): Promise<User>
    {
        try {
            if (partialEntity.password) {
                partialEntity.password = await bcrypt.hash(partialEntity.password, 5)
            }
            await this.usersRepository.update(criteria, partialEntity)
            return await this.usersRepository.findOneBy(criteria)
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
        }
    }

    async uploadAvatar(file: Express.Multer.File, user: User): Promise<User> {
        const filePath = path.resolve(__dirname, "..", "static/avatars")
        const fileName = "avatars/" + await this.fileService.createFile(file, filePath)

        // deleting prev user avatar from storage
        const prevFilePath = path.resolve(__dirname, "..", "static/" + user.avatar)
        fs.rm(prevFilePath, () => {})

        return await this.update({id: user.id}, {avatar: fileName})
    }

    async deleteUser(id: number) {
        const user = await this.getOne({where: {id: id}})

        //Deleting user avatar image file from storage
        const imageFilePath = path.resolve(__dirname, "..", "static/" + user.avatar)
        fs.rm(imageFilePath, () => {})

        await this.usersRepository.delete(id)

        return {result: true}
    }

    async getUserById(id: number, req_user: User) {
        const user = await this.getOne({where: {id: id}, relations: {followers: true, albums: true, tracks: true}})

        if(!user) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)

        return {...user, isFollowedByUser: user.followers.some(value => value.id === req_user.id)}
    }

    async getOne(options: FindOneOptions<User>) {
        return await this.usersRepository.findOne(options)
    }

    async addRole(dto: AddRoleDto): Promise<User> {
        const user = await this.getOne({where: {id: dto.userId}, relations: {roles: true}})
        const role = await this.roleService.getRoleByValue(dto.value)
        if(role && user){
            if (!user.roles.some((value => value.value === dto.value))) {
                user.roles.push(role)
                await this.usersRepository.save(user)
            }
            return user
        }
        throw new HttpException("User or Role is not found", HttpStatus.NOT_FOUND)
    }

    async removeRole(dto: AddRoleDto) {
        const user = await this.getOne({where: {id: dto.userId}, relations: {roles: true}})
        const role = await this.roleService.getRoleByValue(dto.value)

        if(role && user){
            user.roles = user.roles.filter(value => value.value !== dto.value)
            await this.usersRepository.save(user)
            return user
        }
        throw new HttpException("User or Role is not found", HttpStatus.NOT_FOUND)
    }

    async followUser(id: number, follower: User) {
        const user = await this.getOne({where: {id: id}, relations: {followers: true}})
        if(!user) {
            throw new HttpException("User with provided credentials not found", HttpStatus.NOT_FOUND)
        }

        if(user.id === follower.id) {
            throw new HttpException("You can't follow yourself", HttpStatus.BAD_REQUEST)
        }

        if (!user.followers.some(value => value.id === follower.id)) {
            user.followers.push(follower)
            await this.usersRepository.save(user)
        }
    }

     async unfollowUser(id: number, follower: User) {
       const user = await this.getOne({where: {id: id}, relations: {followers: true}})
        if(!user) {
            throw new HttpException("User with provided credentials not found", HttpStatus.NOT_FOUND)
        }

        if(user.id === follower.id) {
            throw new HttpException("You can't unfollow yourself", HttpStatus.BAD_REQUEST)
        }

        if (user.followers.some(value => value.id === follower.id)) {
            user.followers = user.followers.filter(value => value.id !== follower.id)
            await this.usersRepository.save(user)
        }
    }


}
