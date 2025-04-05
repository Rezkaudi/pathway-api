import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        statusCode: 404,
        message: `Not Found - ${req.originalUrl}`,
    });
};