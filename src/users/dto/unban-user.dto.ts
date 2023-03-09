import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class UnbanUserDto {
  @ApiProperty({ example: "1", description: "User Id" })
  @IsNumber({}, { message: "Must be a number" })
  readonly userId: number;
}