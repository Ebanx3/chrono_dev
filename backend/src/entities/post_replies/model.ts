import PostReplies from './schema'

const createPostReplyModel = async (
    {authorUsername, authorId, postId, content}:
    {
        authorUsername: String, 
        authorId: String, 
        postId: String, 
        content: String,
    }
 ) => {
    try{
        const newReplyPost = new PostReplies({authorUsername, authorId, postId, content})
        await newReplyPost.save()
    }
    catch(err){
        console.error("Error al responder una publicacion: ", err);
        return "Error inesperado al responder la publicacion"
    }
}

const getPostRepliesModel = async () => {
    try{
        return await PostReplies.find()
    }
    catch(err){
        console.log(err)
        return null
    }  
}

export const ReplyPost = {createPostReplyModel, getPostRepliesModel}