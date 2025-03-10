import { Request, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (req : Request, next : NextFunction, schema : ObjectSchema ) => {
    const options = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    }

    const {error, value} = schema.validate(req.body,options);
    if(error){
        next(`Validation error: ${error.details.map(x => x.message).join(', ')}`)
    }
    else{
        req.body = value;
        next();
    }
}