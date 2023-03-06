import {Exclude, Transform} from "class-transformer";

import {Playlist} from "../playlist.entity";
import {User} from "../../users/users.entity";

export class PlaylistOutDto extends Playlist {

    @Exclude()
    usersLiked

    @Exclude()
    tracks

    @Transform(({obj}) => obj.id)
    owner : User

    likes ?: number

    isLikedByUser ?: boolean

}

