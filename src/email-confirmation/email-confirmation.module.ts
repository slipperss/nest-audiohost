import {Module} from '@nestjs/common';

import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('SECRET_KEY'),
          signOptions: {
            expiresIn: `${configService.get('EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`,
            algorithm: "HS384"
          }
        }),
    }),
  ],
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}