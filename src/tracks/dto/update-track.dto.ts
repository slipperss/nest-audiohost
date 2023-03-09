import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class UpdateTrackDto {
  @ApiProperty({
    required: false,
    example: "Tsukuyomi",
    description: "Track Title",
  })
  @IsOptional()
  @IsString()
  @Length(4, 25, { message: "Must be at least 4 and more than 25" })
  readonly title: string;
}
