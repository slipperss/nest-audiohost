import {HttpException, HttpStatus} from "@nestjs/common";

export function filesFilter(req, file, cb) {

    if (file.fieldname === "music") {
        const mimeTypeList = ["video/mp4", "audio/mpeg"]
        const isValidMimeType = mimeTypeList.some(value => value === file.mimetype)

        if (!isValidMimeType) {
            return cb(
                new HttpException("Allowed extensions of [music] file are: (.mp3, .mp4)", HttpStatus.BAD_REQUEST),
                false
            )
        }
    }

    if (file.fieldname === "image") {
        const mimeTypeList = ["image/png", "image/jpeg"]
        const isValidMimeType = mimeTypeList.some(value => value === file.mimetype)

        if (!isValidMimeType) {
            return cb(
                new HttpException("Allowed extensions of [image] file are: (.jpg, .jpeg, .png)", HttpStatus.BAD_REQUEST),
                false
            )
        }
    }
    return cb(null, true)
}