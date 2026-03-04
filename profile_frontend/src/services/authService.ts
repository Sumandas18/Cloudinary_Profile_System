import axiosInstance from "../utils/axiosInstance";

export const authService = {
  async register(formData: FormData) {
    const response = await axiosInstance.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async login(data: any) {
    const response = await axiosInstance.post("/login", data);
    return response.data;
  },

  async getMe() {
    const response = await axiosInstance.get("/me");
    return response.data;
  },

  async updateProfile(id: string, formData: FormData) {
    const response = await axiosInstance.put(`/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteProfile(id: string) {
    const response = await axiosInstance.delete(`/delete/${id}`);
    return response.data;
  },
};
