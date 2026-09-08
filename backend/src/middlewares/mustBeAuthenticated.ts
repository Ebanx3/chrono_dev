import { NextFunction,Response } from "express";
import { RequestWithData, ServerResponse } from "../types";

export const mustBeAuthenticated = (req:RequestWithData ,res:Response<ServerResponse>,next:NextFunction) => {
    if(req.user == undefined){
        res.status(401).json({success:false, message:"Unauthorized", isLoggedIn:false});
        return;
    }
    next();
}