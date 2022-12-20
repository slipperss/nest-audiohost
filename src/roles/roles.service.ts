import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {FindOneOptions} from "typeorm/find-options/FindOneOptions";

import {CreateRoleDto} from "./dto/create-role.dto";
import {Role} from "./roles.entity";


@Injectable()
export class RolesService {

    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) {}

    async createRole(dto: CreateRoleDto): Promise<Role>{
        try{
            const role = await this.roleRepository.create(dto)
            return await this.roleRepository.save(role)
        } catch (e) { return e }
    }

    async getOne(options: FindOneOptions<Role>) {
        return await this.roleRepository.findOne(options)
    }

    async getRoleByValue(value: string){
        const role = await this.getOne({where: {value: value}})
        if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        return role
    }

    async update(criteria: FindOptionsWhere<Role>, partialEntity: QueryDeepPartialEntity<Role>){
        const role = await this.roleRepository.findOneBy(criteria)
        if(!role) throw  new HttpException("Not Found", HttpStatus.NOT_FOUND)

        await this.roleRepository.update(criteria, partialEntity)
        return await this.roleRepository.findOneBy(criteria)
    }

    async deleteRole(id: number){
        const role = await this.roleRepository.findOneBy({id: id})
        if (!role) throw new HttpException("Not Found", HttpStatus.NOT_FOUND)
        return await this.roleRepository.delete(role.id)
    }

}
