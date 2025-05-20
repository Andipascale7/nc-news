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
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            <Link to={`/articles/${article.article_id}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
