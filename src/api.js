import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://nc-news-api-f09o.onrender.com",
  timeout: 10000,
});
function getAllArticles() {
  return apiClient.get("/api/articles").then((response) => {
    return response.data.articles;
  })
};


export default getAllArticles;
