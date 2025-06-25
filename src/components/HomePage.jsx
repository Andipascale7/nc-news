import { useState, useEffect } from "react";
import getAllArticles from "../api";
import { Link } from "react-router-dom";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading articles</div>;
  }

  return (
    <div>
      <Link to="/topics" className="browse-topics-btn">
        Browse by Topics
      </Link>
      

      <div className="articles-grid">
        {articles.map((article) => (
          <Link 
            key={article.article_id} 
            to={`/articles/${article.article_id}`}
            className="article-card-link"
          >
            <article className="article-card">
              <div className="article-image-wrapper">
                <img
                  src={article.article_img_url}
                  alt=""
                  className="article-card-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300/f0f0f0/999999?text=NC+News';
                  }}
                />
                <div className="article-overlay">
                  <span className="article-topic">{article.topic}</span>
                </div>
              </div>
              
              <div className="article-content">
                <h3 className="article-title">
                  {article.title}
                </h3>
                
                <div className="article-meta">
                  <span className="article-author">{article.author}</span>
                  <span className="article-date">
                    {new Date(article.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  
                  <div className="article-stats">
                    <div className="stat-item">
                      <span className="stat-value">{article.votes}</span>
                      <span>votes</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{article.comment_count}</span>
                      <span>comments</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

