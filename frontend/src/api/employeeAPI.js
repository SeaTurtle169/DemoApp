import api from "../api/axiosConfig";


export const getEmployeeList = () => api.get("/getEmployeeList");


export const checkAssetOther = async (idEmployee) => {
    try {
        const res = await api.post("/checkAssetOther", { idEmployee });
        console.log("res checkAssetOther:", res);
        return res;
    } catch (err) {
        console.error("Lỗi khi gọi /checkAssetOther:", err);
        return false;
    }
};

// Tạo nhân viên mới
export const createEmployee = async (formData) => {
    try {
        return await api.post(`/employee`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi tạo nhân viên";
    }
};



// Cập nhật nhân viên
export const updateEmployee = async (id, formData) => {
    try {
        return await api.post(`/employee/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi cập nhật nhân viên";
    }
};

// Xoá nhân viên
export const deleteEmployee = async (id) => {
    try {
        return await api.delete(`/employee/${id}`);
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi xoá nhân viên";
    }
};
