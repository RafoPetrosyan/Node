import md5 from "md5";
const {PASSWORD_SECRET} = process.env;

export const hashPassword = (password) => md5(md5(password) + PASSWORD_SECRET);