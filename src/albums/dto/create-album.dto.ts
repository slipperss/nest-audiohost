import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateAlbumDto {
  @ApiProperty({
    required: true,
    example: "Top 5 Tracks of 2021",
    description: "Playlist Title",
  })
  @IsString()
  @Length(4, 25, { message: "Must be at least 4 and more than 25" })
  readonly title: string;
}
