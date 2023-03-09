import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersService } from "../../users/users.service";
import { JwtAccessTokenPayload } from "../interfaces/accessTokenPayload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authorization;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("SECRET_KEY"),
    });
  }

  async validate(payload: JwtAccessTokenPayload) {
    const user = await this.userService.getOne({
      relations: {
        followers: true,
        playlists: true,
        likedPlaylists: true,
        likedTracks: true,
        tracks: true,
        likedAlbums: true,
        albums: true,
        listenedTracks: true,
        roles: true,
      },
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        verified: true,
        last_activity: true,
        createdAt: true,
        updatedAt: true,
        banned: true,
        banReason: true,
      },
    });
    return user;
  }
}
