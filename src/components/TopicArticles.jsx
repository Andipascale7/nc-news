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
  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <ErrorApp message={error} />;

  const handleSortChange = (event) => {
    setSearchParams({ sort_by: event.target.value, order });
  };

  const handleOrderToggle = () => {
    setSearchParams({ sort_by, order: order === "asc" ? "desc" : "asc" });
  };


  const [featuredArticle, ...regularArticles] = articles;

  return (
    <div className="topic-articles-page">
      <section className="topic-hero">
        <div className="topic-hero-content">
          <h1 className="topic-page-title">
            {topic_slug.charAt(0).toUpperCase() + topic_slug.slice(1)}
          </h1>
          <p className="topic-page-subtitle">
            Latest articles and insights about {topic_slug}
          </p>
        </div>
      </section>

      <section className="topic-controls">
        <div className="controls-container">
          <div className="sort-controls">
            <label htmlFor="sort_by">Sort by:</label>
            <select id="sort_by" value={sort_by} onChange={handleSortChange}>
              <option value="created_at">Date</option>
              <option value="votes">Votes</option>
              <option value="comment_count">Comments</option>
            </select>
            <button onClick={handleOrderToggle} className="order-btn">
              {order === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
          <div className="article-count">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {featuredArticle && (
        <section className="featured-article-section">
          <Link to={`/articles/${featuredArticle.article_id}`} className="featured-article-link">
            <article className="featured-article">
              <div className="featured-image-wrapper">
                <img
                  src={featuredArticle.article_img_url}
                  alt=""
                  className="featured-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=Featured+Article';
                  }}
                />
                <div className="featured-overlay">
                  <span className="featured-topic">{featuredArticle.topic}</span>
                </div>
              </div>
              <div className="featured-content">
                <h3 className="featured-title">{featuredArticle.title}</h3>
                <p className="featured-excerpt">
                  {featuredArticle.body 
                    ? featuredArticle.body.substring(0, 200) + '...'
                    : 'Click to read the full article'
                  }
                </p>
                <div className="featured-meta">
                  <span className="featured-author">By {featuredArticle.author}</span>
                  <span className="featured-date">
                    {new Date(featuredArticle.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="featured-stats">
                    <span>👍 {featuredArticle.votes}</span>
                    <span>💬 {featuredArticle.comment_count}</span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {regularArticles.length > 0 && (
        <section className="regular-articles-section">
          <h2 className="section-title">More Articles</h2>
          <div className="regular-articles-grid">
            {regularArticles.map((article) => (
              <Link 
                key={article.article_id} 
                to={`/articles/${article.article_id}`}
                className="regular-article-link"
              >
                <article className="regular-article">
                  <div className="regular-image-wrapper">
                    <img
                      src={article.article_img_url}
                      alt=""
                      className="regular-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/f0f0f0/999999?text=Article';
                      }}
                    />
                  </div>
                  <div className="regular-content">
                    <h4 className="regular-title">{article.title}</h4>
                    <div className="regular-meta">
                      <span className="regular-author">By {article.author}</span>
                      <span className="regular-date">
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="regular-stats">
                      <span>👍 {article.votes}</span>
                      <span>💬 {article.comment_count}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default TopicArticles;