import api from "./axiosConfig";

// Lấy danh sách personnel
export const getPersonnelList = () => api.get("/getPersonnelList");

// Tạo personnel mới
export const createPersonnel = async (formData) => {
    try {
        return await api.post(`/personnel`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi tạo nhân sự";
    }
};

// Cập nhật personnel
export const updatePersonnel = async (id, formData) => {
    try {
        return await api.post(`/personnel/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi cập nhật nhân sự";
    }
};

// Xoá personnel
export const deletePersonnel = async (id) => {
    try {
        return await api.delete(`/personnel/${id}`);
    } catch (err) {
        throw err.response?.data?.message || "Lỗi khi xoá nhân sự";
    }
};

export const getPersonnelByDepartment = (idDepartment) => {
    return api.get(`/getPersonnelByDepartment?departmentId=${idDepartment}`);
};


// Lấy thông tin chi tiết 1 nhân sự
export const getPersonnelDetail = (id) => {
    return api.get(`/personnel/${id}`);
};

// Lấy lịch sử đánh giá của 1 nhân sự
export const getReportsByPersonnel = (idPersonnel) => {
    return api.get(`/reports?personnelId=${idPersonnel}`);
};

// Lấy chi tiết 1 đánh giá (bao gồm criteria + kết quả)
export const getReportDetail = (idReport) => {
    return api.get(`/reports/${idReport}`);
};

// Gửi form đánh giá mới
export const createReport = async (payload) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = user?.id;

    // Gắn employeeId vào payload
    const finalPayload = {
      ...payload,
      employeeId,
    };

    return await api.post(`/reports`, finalPayload, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    throw err.response?.data?.message || "Lỗi khi tạo báo cáo đánh giá";
  }
};
