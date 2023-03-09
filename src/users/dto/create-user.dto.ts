import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    required: true,
    example: "example@gmail.com",
    description: "Email address",
    nullable: false,
  })
  @IsString({ message: "Must be a string" })
  @IsEmail({}, { message: "Uncorrected email" })
  readonly email: string;
  @ApiProperty({
    required: true,
    example: "megatron123",
    description: "Username",
    nullable: false,
  })
  @IsString({ message: "Must be a string" })
  @Length(4, 15, { message: "Must be at least 4 and more than 16" })
  readonly username: string;
  @ApiProperty({
    required: false,
    example: "12345678",
    description: "Password",
    nullable: false,
  })
  @IsString({ message: "Must be a string" })
  @Length(4, 25, { message: "Must be at least 4 and more than 16" })
  password: string;
}
