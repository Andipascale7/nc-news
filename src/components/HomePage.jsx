import { useState, useEffect } from "react";
import getAllArticles from "../api";

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
          <li key={article.article_id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
