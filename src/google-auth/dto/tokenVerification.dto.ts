import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokenVerificationDto {
  @ApiProperty({
    example: "token",
    description: "Token for google verification",
  })
  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "Must not be empty" })
  token: string;
}

export default TokenVerificationDto;
