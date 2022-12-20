import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";
import {plainToInstance} from "class-transformer";
import {ValidationException} from "../exceptions/validation.exception";
import {validate} from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToInstance(metadata.metatype, value)
        const errors = typeof obj === "object" ? await validate(obj) : []
        if (errors.length) {
            let messages = errors.map(err => {
                return `${err.property} - ${Object.values(err.constraints).join(", ")}`
            })
            throw new ValidationException(messages)
        }
        return value
    }
}
