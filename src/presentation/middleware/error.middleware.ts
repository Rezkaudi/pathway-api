import { Request, Response, NextFunction } from 'express';

import { ApplicationError } from '../../application/errors/application-error';


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof ApplicationError) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error'
    });

};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        statusCode: 404,
        message: `Not Found - ${req.originalUrl}`,
    });
};
