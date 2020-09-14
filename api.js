import axios from "axios";

const req = axios.create({
  baseURL: "https://call-of-duty-modern-warfare.p.rapidapi.com",
  headers: {
    "content-type": "application/octet-stream",
    "x-rapidapi-host": "call-of-duty-modern-warfare.p.rapidapi.com",
    "x-rapidapi-key": "b15609cb8emshb7bcc168530f9fcp179e0bjsnefc59dc2737a",
    "useQueryString": true,
  },
});

const API = {
  stat: (gamertag, platform) => req.get(`/warzone/${gamertag}/${platform}`),
  matches: (gamertag, platform) => req.get(`/warzone-matches/${gamertag}/${platform}`),
};

export default API;
