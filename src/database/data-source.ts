import {DataSource, DataSourceOptions} from "typeorm"
import {config} from 'dotenv'

config()

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: String(process.env.TYPEORM_PASSWORD),
    database: process.env.TYPEORM_DATABASE,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
    ],
    logging: true,
    synchronize: false,
    migrations: ["build/database/migrations/*.js"],
    migrationsRun: false,
}

export const appDataSource = new DataSource(dataSourceOptions)
