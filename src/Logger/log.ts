import { WinstonLogger, WinstonModule } from "nest-winston";
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const loggerConfig = WinstonModule.createLogger({
    transports:[
        // Console transport for logging to the console
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.colorize({all:true})
            )
        }),

        new winston.transports.DailyRotateFile({
            filename:'logs/application-%DATE%.log',
            datePattern:'YYYY-MM-DD',
            maxSize:'20m',
            maxFiles:'14d',
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
        new winston.transports.DailyRotateFile({
            level:'error',
            filename:'logs/error-%DATE%.log',
            datePattern:'YYYY-MM-DD',
            maxSize:'20m',
            maxFiles:'14d',
            format:winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })


        
    ]
  
})