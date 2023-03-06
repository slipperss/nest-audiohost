import {ConfigService} from "@nestjs/config";
import {Process, Processor} from "@nestjs/bull";
import { Job } from "bull"

import * as SendGrid from "@sendgrid/mail";

import {EmailConfirmationService} from "./email-confirmation.service";
import {SENDEMAIL_QUEUE} from "../constants";


@Processor(SENDEMAIL_QUEUE)
export class SendEmailConsumer {

    constructor(
        private emailConfirmationService: EmailConfirmationService,
        private configService: ConfigService
    ) {
        SendGrid.setApiKey(configService.get("SENDGRID_API_KEY"))
    }

    @Process()
    async processSendEmail(job: Job) {
        await SendGrid.send({...job.data})
    }
}
