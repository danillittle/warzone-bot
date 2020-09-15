import axios from "axios";

const req = axios.create({
  baseURL: "https://call-of-duty-modern-warfare.p.rapidapi.com",
  headers: {
    "content-type": "application/octet-stream",
    "x-rapidapi-host": "call-of-duty-modern-warfare.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "useQueryString": true,
  },
});

const API = {
  stat: (gamertag, platform) => req.get(`/warzone/${gamertag}/${platform}`),
  matches: (gamertag, platform) => req.get(`/warzone-matches/${gamertag}/${platform}`),
};

export default API;
