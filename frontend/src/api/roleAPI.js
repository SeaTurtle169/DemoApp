import api from "../api/axiosConfig";


export const getRoleList = () =>  api.get("/getRoles");


