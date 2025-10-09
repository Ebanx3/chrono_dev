import User, {IUser} from "./schema";
import { hashPassword, comparePasswords } from "../../services/encryptPass";

const create = async ({email,username,password}:{email:string, username:string, password:string})=> {
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({email, username, password:hashedPassword});
        const res = await newUser.save();
        console.log(res)
        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

const getUserById = async () => {}
const getUserByUsername = async () => {}
const getUsers = async () => {}

export const UserModel = {create, getUserById, getUserByUsername, getUsers}