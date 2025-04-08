import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;

    console.error(`Error: ${err.message || 'Internal Server Error'}`);

    res.status(statusCode).json({
        statusCode,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });

};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        statusCode: 404,
        message: `Not Found - ${req.originalUrl}`,
    });
};
