import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { BullModule } from "@nestjs/bull";

import { EmailConfirmationService } from "./email-confirmation.service";
import { EmailConfirmationController } from "./email-confirmation.controller";
import { UsersModule } from "../users/users.module";
import { SendEmailConsumer } from "./send-email.consumer";
import { SENDEMAIL_QUEUE } from "../constants";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: {
          expiresIn: `${configService.get(
            "EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME"
          )}s`,
          algorithm: "HS384",
        },
      }),
    }),
    BullModule.registerQueueAsync({ name: SENDEMAIL_QUEUE }),
  ],
  providers: [EmailConfirmationService, SendEmailConsumer],
  controllers: [EmailConfirmationController],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
