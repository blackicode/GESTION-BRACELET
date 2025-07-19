import axios from "axios";

const API_URL = "http://192.168.195.65:8080/fingerprints"; // Remplace par ton URL backend

export const getFingerprintByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/${email}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des empreintes:", error);
    return null;
  }
};
