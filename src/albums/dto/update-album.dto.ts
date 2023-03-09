import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateAlbumDto {
  @ApiProperty({
    required: true,
    example: "Top 5 Tracks of 2021",
    description: "Playlist Title",
  })
  @IsOptional()
  @IsString()
  @Length(4, 25, { message: "Must be at least 4 and more than 25" })
  readonly title: string;
}
