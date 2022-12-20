import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import {AuthService} from "../auth/auth.service";
import {User} from "../users/users.entity";

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  handleRegisteredUser(user: User) {
    if (!user.isRegisteredWithGoogle) {
      throw new UnauthorizedException()
    }
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken({
        id: user.id,
        email: user.email,
        username: user.username
    })

    return accessTokenCookie
  }

  async registerUser(token: string, email: string) {
    const userData = await this.getUserData(token);
    const username = userData.name;

    const user = await this.usersService.createWithGoogle(email, username);
    if (!user) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
    }

    return this.handleRegisteredUser(user);
  }


  async authenticate(token: string) {
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    const email = tokenInfo.email;

    const user = await this.usersService.getOne({where: {email: email}, select: {id: true, isRegisteredWithGoogle: true}});

    if (!user) {
      return this.registerUser(token, email);
    }

    return this.handleRegisteredUser(user);
  }
}