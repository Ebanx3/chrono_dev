import User, {IUser} from "./schema";
import { hashPassword, comparePasswords } from "../../services/encryptPass";

const create = async ({email,username,password}:{email:string, username:string, password:string})=> {
    
}
const getUserById = async () => {}
const getUserByUsername = async () => {}
const getUsers = async () => {}

export const UserModel = {create, getUserById, getUserByUsername, getUsers}