import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function TopicArticles() {
  const { topic_slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://nc-news-api-f09o.onrender.com/api/articles?topic=${topic_slug}`
      )
      .then(({ data }) => {
        setArticles(data.articles);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch articles for topic.");
        setLoading(false);
        console.error(err);
      });
  }, [topic_slug]);

  if (!topic_slug) return;
  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Articles about {topic_slug}</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.article_id}>
            <Link to={`/articles/${article.article_id}`}>
              <h3>{article.title}</h3>
            </Link>
            <p>
              {article.author} | Votes: {article.votes}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicArticles;
