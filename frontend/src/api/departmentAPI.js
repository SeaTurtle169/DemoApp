import api from "../api/axiosConfig";


export const getDepartmentList = () =>  api.get("/getDepartments");