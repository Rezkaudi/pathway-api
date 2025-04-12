import { Request, Response, NextFunction } from 'express';

import { ApplicationError } from '../../application/errors/application-error';
import { ApplicationResponse } from '../../application/response/application-resposne';


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ApplicationError) {
        return new ApplicationResponse(res, {
            statusCode: err.statusCode,
            success: false,
            message: err.message,
            data: { ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) },
        }).send()
    }

    return new ApplicationResponse(res, {
        statusCode: 500,
        success: false,
        message: err.message || 'Internal Server Error',
        data: { ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) },
    }).send()

};

export const notFoundHandler = (req: Request, res: Response) => {
    return new ApplicationResponse(res, {
        statusCode: 404,
        success: false,
        message: `Not Found - ${req.originalUrl}`,
        data: {}
    }).send()
};
