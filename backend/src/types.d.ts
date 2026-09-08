import { Request } from "express";

export type ServerResponse = {
    success:boolean;
    message: string;
    data?:any;
    isLoggedIn:boolean;
}

interface RequestWithData extends Request {
    user?: Pick<IUser, 'username' | 'id' | 'email'>;
    validatedData?: any;
    cookies: { [key: string]: string };
}