import { useState, useEffect } from "react";
import getAllArticles from "../api";
import { Link } from "react-router-dom";

function HomePage() {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    getAllArticles().then((data) => {
      setArticles(data);
    });
  }, []);

  return (
    <div>
      <Link to="/topics">Browse Topics</Link>
      <h1>All Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            <img
              src={article.article_img_url}
              alt={`Thumbnail for ${article.title}`}
            />
            <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
