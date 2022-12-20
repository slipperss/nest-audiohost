import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from "../auth/auth.module";
import {UsersModule} from "../users/users.module";
import {GoogleAuthController} from "./google-auth.controller";
import {GoogleAuthService} from "./google-auth.service";

@Module({
  imports: [
      ConfigModule,
      AuthModule,
      UsersModule
  ],
  providers: [GoogleAuthService],
  controllers: [GoogleAuthController]
})
export class GoogleAuthModule {}
