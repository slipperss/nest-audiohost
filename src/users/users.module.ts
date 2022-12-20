import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {RolesModule} from "../roles/roles.module";
import {User} from "./users.entity";
import {FilesModule} from "../files/files.module";

@Module({
  imports: [
      RolesModule,
      FilesModule,
      TypeOrmModule.forFeature([User])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
