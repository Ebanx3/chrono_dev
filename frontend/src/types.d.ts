type Project = {
    name: string;
    details:string;
    id:string;
}

type Link = {
    site:string;
    link:string;
}

type Post = {
    title:string;
    content:string;
    date:string;
    id:string;
}

type User = {
    username: string;
    email:string;
    urlAvatar?:string;
    title?:string;
    description?:string;
    stack:string[];
    links:Link[];
    projects: Project[];
    posts:Post[];
}