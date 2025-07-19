import axios from "axios";

const API_URL = "http://localhost:5000/access";

// Ajouter un journal d'accès
export const logAccess = async (data) => {
  return axios.post(`${API_URL}/log`, data);
};

// Récupérer les journaux d'accès
export const getAccessLogs = async (userType) => {
  const params = userType ? { userType } : {};
  return axios.get(`${API_URL}/logs`, { params });
};
