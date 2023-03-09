import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import TokenVerificationDto from "./dto/tokenVerification.dto";
import { GoogleAuthService } from "./google-auth.service";
import { Request } from "express";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import RoleGuard from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("api/auth")
@UseInterceptors(ClassSerializerInterceptor)
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @ApiOperation({ summary: "Google Authentication User" })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(RoleGuard(["admin"]))
  @UseGuards(JwtAuthGuard)
  @Post("/google")
  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request
  ) {
    try {
      const accessTokenCookie = await this.googleAuthService.authenticate(
        tokenData.token
      );
      request.res.setHeader("Set-Cookie", accessTokenCookie);
      request.res.sendStatus(200);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
