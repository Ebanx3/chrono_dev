import {Request, Response} from 'express'
import { ReplyPost } from './model'
import { RequestWithData, ServerResponse } from '../../types'
import { validateBodyCreatePostReply } from './zod'

const createPostReply = async (req: RequestWithData, res: Response<ServerResponse>) => {
    try{
        const validatedBody = await validateBodyCreatePostReply(req.body)

        if(typeof validatedBody === "string"){
            res.status(400).json({ success: false, message: validatedBody });
            return;
        }

        const newPostreply = await ReplyPost.createPostReplyModel({
            authorUsername: req.user!.username,
            authorId: req.user!.id,
            postId: req.params.postId,
            ...validatedBody
        });

        if(typeof newPostreply === "string"){
            res.status(400).json({
                success: false,
                message: newPostreply,
            });
            return;
        }   
        res.status(201).json({ success: true, message: "Ok" });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const getAllPostsRely = async (_req: Request, res: Response<ServerResponse>) => {
  try {
    const postReply = await ReplyPost.getPostRepliesModel();

    if (!postReply) {
      res
        .status(404)
        .json({ success: false, message: "No se encontraron publicaciones para responder" });
      return;
    }

    res.status(201).json({ success: true, message: "Ok", data: postReply });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const ReplyPostController = {
    createPostReply,
    getAllPostsRely
}