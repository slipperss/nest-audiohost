import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { CreateUserDto } from "../users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { TokenOutDto } from "./dto/token-out.dto";
import { AuthUserDto } from "../users/dto/auth-user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Authorization User" })
  @ApiResponse({ status: 200, description: "Successfully authorized" })
  @ApiBearerAuth()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() userDto: AuthUserDto, @Request() req) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    });
    req.res.setHeader("Set-Cookie", accessTokenCookie);
    req.res.sendStatus(200);
  }

  @ApiOperation({ summary: "Log-Out User" })
  @ApiResponse({ status: 200, description: "Successfully logged out" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("log-out")
  async logout(@Request() req) {
    req.res.setHeader("Set-Cookie", this.authService.getCookieForLogOut());
    req.res.sendStatus(200);
  }

  @ApiOperation({ summary: "Registration User" })
  @ApiResponse({ status: 200 })
  @HttpCode(201)
  @Post("sign-up")
  async registration(@Body() userDto: CreateUserDto) {
    await this.authService.registration(userDto);
    return { result: `Verification email has been sent to ${userDto.email}` };
  }
}
