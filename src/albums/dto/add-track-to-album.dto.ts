import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, } from "class-validator";

export class AddTrackToAlbumDto {

    @ApiProperty({required: true, example: 2, description: "Track Id"})
    @IsNumber()
    readonly trackId: number
}