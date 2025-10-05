import api from "../api/axiosConfig";

export const getCriteriaList = () => api.get("/getCriteriaList");

// 🔹 Lấy toàn bộ competency
export const getCompetencyList = () => api.get("/getCompetencyList");

// 🔹 Thêm competency
export const addCompetency = (data) => api.post("/addCompetency", data);

// 🔹 Xóa competency
export const deleteCompetency = (id) => api.delete(`/deleteCompetency/${id}`);

// 🔹 Cập nhật competency
export const updateCompetency = (id, data) => api.put(`/updateCompetency/${id}`, data);

// 🔹 Thêm criteria
export const addCriteria = (data) => api.post("/addCriteria", data);

// 🔹 Xóa criteria
export const deleteCriteria = (id) => api.delete(`/deleteCriteria/${id}`);

// 🔹 Cập nhật criteria
export const updateCriteria = (id, data) => api.put(`/updateCriteria/${id}`, data);

export const getCriteriaByCompetency = (competencyId) => {
  return api.get(`/getCriteriaByCompetency?competencyId=${competencyId}`);
};