import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./roles.entity";
import RoleGuard from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UpdateRoleDto } from "./dto/update-role.dto";

@ApiTags("roles")
@Controller("api/roles/")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: "Creating Role" })
  @ApiResponse({ status: 201, type: Role })
  @ApiBearerAuth()
  @UseGuards(RoleGuard(["admin"]))
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({ summary: "Get Role By Value" })
  @ApiResponse({ status: 200, type: Role })
  @ApiBearerAuth()
  @UseGuards(RoleGuard(["admin"]))
  @UseGuards(JwtAuthGuard)
  @Get(":value")
  getByValue(@Param("value") value: string) {
    return this.roleService.getRoleByValue(value);
  }

  @ApiOperation({ summary: "Update Role By Id" })
  @ApiResponse({ status: 200, type: Role })
  @ApiBearerAuth()
  @UseGuards(RoleGuard(["admin"]))
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  updateRole(@Param("id") id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update({ id: id }, dto);
  }

  @ApiOperation({ summary: "Delete Role By Id" })
  @ApiResponse({ status: 204 })
  @ApiBearerAuth()
  @UseGuards(RoleGuard(["admin"]))
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteRole(@Param("id") id: number) {
    return this.roleService.deleteRole(id);
  }
}
