import axios from "axios";

const API_URL = "http://localhost:5000/api/security";

export const recordFailedAttempt = async (message) => {
  try {
    const response = await axios.post(`${API_URL}/failed-attempt`, { message });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la tentative :", error);
    throw error;
  }
};
