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

  return (
    <div>
    <section className="topic-info-section">
  <p className="topic-main-subtitle">
    Latest on {topic_slug}
  </p>
  
  <div className="topic-controls">
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
  </div>
</section>

      <main id="main-content">
        <section 
          className="articles-grid"
          role="region"
          aria-label={`${topic_slug} articles`}
          aria-describedby="articles-description"
        >
          <div id="articles-description" className="sr-only">
            A grid of {articles.length} articles about {topic_slug}. Use arrow keys to navigate.
          </div>
          
          {articles.map((article) => (
            <Link 
              key={article.article_id} 
              to={`/articles/${article.article_id}`}
              className="article-card-link"
              aria-label={`Read article: ${article.title} by ${article.author}`}
              tabIndex="0"
            >
              <article className="article-card">
                <div className="article-image-wrapper">
                  <img
                    src={article.article_img_url}
                    alt={`Illustration for article: ${article.title}`}
                    className="article-card-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/f0f0f0/999999?text=NC+News';
                      e.target.alt = 'Default news placeholder image';
                    }}
                  />
                  <div className="article-overlay">
                    <span className="article-topic" aria-label={`Topic: ${article.topic}`}>
                      {article.topic}
                    </span>
                  </div>
                </div>
                
                <div className="article-content">
                  <h3 className="article-title">
                    {article.title}
                  </h3>
                  
                  <div className="article-meta" id={`article-${article.article_id}-desc`}>
                    <span className="article-author">By {article.author}</span>
                    <span className="article-date">
                      <time dateTime={article.created_at}>
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </span>
                    
                    <div className="article-stats" aria-label="Article engagement statistics">
                      <div className="stat-item">
                        <span className="stat-value" aria-label={`${article.votes} votes`}>
                          {article.votes}
                        </span>
                        <span aria-hidden="true">votes</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value" aria-label={`${article.comment_count} comments`}>
                          {article.comment_count}
                        </span>
                        <span aria-hidden="true">comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

export default TopicArticles;