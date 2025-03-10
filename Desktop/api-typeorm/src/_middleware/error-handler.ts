import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err); 

    if (typeof err === 'string') {
        const statusCode = err.toLowerCase().endsWith('not found') ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }

    if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
    }

    return res.status(500).json({ message: "An unknown error occurred" });
};
