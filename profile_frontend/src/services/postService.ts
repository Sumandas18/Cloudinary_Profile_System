import axiosInstance from "../utils/axiosInstance";

export const postService = {
  async getAllPosts() {
    const response = await axiosInstance.get("/api/posts");
    return response.data;
  },

  async getSinglePost(id: string) {
    const response = await axiosInstance.get(`/api/posts/${id}`);
    return response.data;
  },

  async createPost(formData: FormData) {
    const response = await axiosInstance.post("/api/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updatePost(id: string, formData: FormData) {
    const response = await axiosInstance.put(`/api/posts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deletePost(id: string) {
    const response = await axiosInstance.delete(`/api/posts/${id}`);
    return response.data;
  },
};
