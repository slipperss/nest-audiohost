import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateRoleDto {
  @ApiProperty({ example: "admin", description: "Role Value" })
  @IsString({ message: "Must be a string" })
  @Length(1)
  readonly value: string;
  @ApiProperty({
    example: "Administrator Rights",
    description: "Role Description",
  })
  @IsString({ message: "Must be a string" })
  @Length(1)
  readonly description: string;
}
