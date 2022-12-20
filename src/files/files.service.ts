import {HttpException, HttpStatus, Injectable} from '@nestjs/common';

import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'

@Injectable()
export class FilesService {

    async createFile(file, save_path){
        try {
            const fileExtension = file.mimetype.split("/")[1]
            const fileName = uuid.v4() + `.${fileExtension}`
            const filePath = save_path ? save_path : path.resolve(__dirname, "..", "static")
            if(!fs.existsSync(filePath)){
                fs.mkdir(filePath,() => {})
            }
            await fs.writeFile(path.join(filePath, fileName), file.buffer, () => {})
            return fileName
        } catch (e) {
            throw new HttpException("An error occurred while writing the file", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
