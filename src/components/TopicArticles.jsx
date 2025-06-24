import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ErrorApp from "./ErrorApp";

function TopicArticles() {
  const { topic_slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validTopics, setValidTopics] = useState([]);
  const sort_by = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";

  useEffect(() => {
    axios
      .get(`https://nc-news-api-f09o.onrender.com/api/topics`)
      .then(({ data }) => {
        const topicSlugs = data.topics.map(topic => topic.slug);
        setValidTopics(topicSlugs);
        
        if (!topicSlugs.includes(topic_slug)) {
          setError("Topic not found");
          setLoading(false);
          return;
        }
        
        return axios.get(`https://nc-news-api-f09o.onrender.com/api/articles`, {
          params: {
            topic: topic_slug,
            sort_by: sort_by,
            order: order,
          },
        });
      })
      .then((response) => {
        if (response) {
          setArticles(response.data.articles);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("Topic not found");
        } else {
          setError("Something went wrong. Please try again later.");
        }
        setLoading(false);
      });
  }, [topic_slug, sort_by, order]);

  if (!topic_slug) return null;
  if (loading) return <p>Loading articles...</p>;
  if (error) return <ErrorApp message={error} />;

  const handleSortChange = (event) => {
    setSearchParams({ sort_by: event.target.value, order });
  };

  const handleOrderToggle = () => {
    setSearchParams({ sort_by, order: order === "asc" ? "desc" : "asc" });
  };

  return (
    <div>
      <h2>Articles about {topic_slug}</h2>
      <div>
        <label htmlFor="sort_by">Sort by: </label>
        <select id="sort_by" value={sort_by} onChange={handleSortChange}>
          <option value="created_at">Date</option>
          <option value="votes">Votes</option>
          <option value="comment_count">Comment Count</option>
        </select>
        <button onClick={handleOrderToggle}>
          Order: {order === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      {articles.length === 0 ? (
        <p>No articles found for this topic.</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.article_id}>
              <Link to={`/articles/${article.article_id}`}>
                <h3>{article.title}</h3>
              </Link>
              <p>
                {article.author} | Votes: {article.votes} | Comments:{" "}
                {article.comment_count}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopicArticles;

