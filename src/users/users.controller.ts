import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Query,
    Request,
    Put,
    Delete,
    Param,
    UploadedFile, UseInterceptors, HttpCode, HttpException, HttpStatus, UploadedFiles
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation, ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";

import {UsersService} from "./users.service";
import {User} from "./users.entity";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UnbanUserDto} from "./dto/unban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import RoleGuard from "../auth/guards/roles.guard";
import {filesFilter} from "../files/filesFilter";

@ApiTags("users")
@Controller("api/users/")
export class UsersController {

    constructor(private usersService: UsersService) {}

    @ApiOperation({summary: "Get Request User Info"})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth()
    @UseGuards(RoleGuard(["user"]))
    @UseGuards(JwtAuthGuard)
    @Get("me")
    async getUserMe(@Request() req){
        return this.usersService.getUserMe(req.user)
    }

    @ApiOperation({summary: "Get All Users"})
    @ApiResponse({status: 200, type: [User]})
    @ApiBearerAuth()
    @ApiQuery({name: "offset", required: false, type: Number, description: "Offset for records"})
    @ApiQuery({name: "limit", required: false, type: Number, description: "Limit number of records"})
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(@Query("offset") offset: number = 0, @Query("limit") limit: number = 0){
        return await this.usersService.getAllUsers(offset, limit)
    }

    @ApiOperation({summary: "Get User By Id"})
    @ApiResponse({status: 200, type: User})
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "User Id"})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(":id")
    async getUserById(@Param("id") id: number, @Request() req){
        return await this.usersService.getUserById(id, req.user)
    }


    @ApiOperation({summary: "Update User"})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put()
    async update(@Body() dto: UpdateUserDto, @Request() req){
        return await this.usersService.update({id: req.user.id}, dto)
    }

    @ApiOperation({summary: "Delete User"})
    @ApiResponse({status: 204, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "User Id"})
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @Delete(":id")
    async delete(@Param("id") id: number){
        return await this.usersService.deleteUser(id)
    }

    @ApiOperation({summary: "Upload User Avatar"})
    @ApiResponse({status: 200})
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: { image: { type: 'string', format: 'binary' } },
          description: "Image for User Avatar",
          nullable: false
        }
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor("image", {fileFilter: filesFilter}))
    @Post("avatar")
    async uploadUserAvatar(@UploadedFile() image: Express.Multer.File, @Request() req){
       if(image) {
           return await this.usersService.uploadAvatar(image, req.user)
       }
       throw new HttpException("Image file not provided", HttpStatus.BAD_REQUEST)
    }


    @ApiOperation({summary: "Add user Role"})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth()
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @Post("role")
    async addRole(@Body() dto: AddRoleDto){
        return await this.usersService.addRole(dto)
    }

    @ApiOperation({summary: "Remove User Role"})
    @ApiResponse({status: 200, type: User})
    @ApiBearerAuth()
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @Put("role")
    async removeUserRole(@Body() dto: AddRoleDto){
        return await this.usersService.removeRole(dto)
    }


    @ApiOperation({summary: "Ban User"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @Post("ban")
    async ban(@Body() dto: BanUserDto){
       await this.usersService.update(
            {id: dto.userId},
            {banned: true, banReason: dto.banReason}
       )
       return {result: true}
    }

    @ApiOperation({summary: "Unban User"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @UseGuards(RoleGuard(["admin"]))
    @UseGuards(JwtAuthGuard)
    @Post("unban")
    async unban(@Body() dto: UnbanUserDto){
        await this.usersService.update(
            {id: dto.userId},
            {banned: false, banReason: ""}
        )
        return {result: true}
    }

    @ApiOperation({summary: "Follow User"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "User Id"})
    @UseGuards(JwtAuthGuard)
    @Post(":id/follow")
    async followUser(@Param("id") id, @Request() req){
        return await this.usersService.followUser(id, req.user)
    }

    @ApiOperation({summary: "Unfollow User"})
    @ApiResponse({status: 200, schema: {example: {result: true}}})
    @ApiBearerAuth()
    @ApiParam({name: "id", type: Number, required: true, example: 1, description: "User Id"})
    @UseGuards(JwtAuthGuard)
    @Post(":id/unfollow")
    async unfollowUser(@Param("id") id, @Request() req){
        return await this.usersService.unfollowUser(id, req.user)
    }

}
