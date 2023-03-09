import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, IsOptional } from "class-validator";

export class UpdateRoleDto {
  @ApiProperty({ example: "admin", description: "Role Name" })
  @IsOptional()
  @IsString({ message: "Must be a string" })
  @Length(4, 15, { message: "Must be at least 4 and more than 16" })
  value: string;

  @ApiProperty({ example: "Admin Rights", description: "Role Description" })
  @IsOptional()
  @IsString({ message: "Must be a string" })
  description: string;
}
