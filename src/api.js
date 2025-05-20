import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://nc-news-api-f09o.onrender.com",
  timeout: 10000,
});
function getAllArticles() {
  return apiClient.get("/api/articles").then((response) => {
    return response.data.articles;
  });
}
export function getCommentsByArticleId(article_id) {
  return apiClient
    .get(`/api/articles/${article_id}/comments`)
    .then((response) => {
      return response.data.comments;
    });
}

export default getAllArticles;
