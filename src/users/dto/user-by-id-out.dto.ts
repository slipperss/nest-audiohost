import {Exclude} from "class-transformer";

import {UserMeOutDto} from "./user-me-out.dto";


export class UserByIdOutDto extends UserMeOutDto{

    @Exclude()
    playlists

    isFollowedByUser ?: boolean
}
