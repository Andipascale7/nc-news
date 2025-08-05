import { useState, useEffect } from "react";
import getAllArticles from "../api";
import { Link } from "react-router-dom";

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  // Typewriter effect for loading
  useEffect(() => {
    if (loading) {
      const fullText = 'Loading the latest news...';
      let i = 0;
      const typewriterTimer = setInterval(() => {
        setLoadingText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          i = 0;
          setLoadingText('');
        }
      }, 100);
      
      return () => clearInterval(typewriterTimer);
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    getAllArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  // Typewriter Loading Component
  const TypewriterLoading = () => {
    return (
      <div className="typewriter-loading-container">
        <div className="typewriter-content">
          <div className="news-icon">📰</div>
          <div className="typewriter-text">
            {loadingText}<span className="typewriter-cursor">|</span>
          </div>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <TypewriterLoading />;
  }

  return (
    <div>
      <div className="browse-topics-header">
        <Link 
          to="/topics"
          className="browse-topics-btn-header"
          aria-label="Browse articles by topic"
        >
        TOPICS
        </Link>
      </div>
      
      <section className="homepage-header">
        <p className="homepage-subtitle">
          Stay informed with the latest articles and insights
        </p>
      </section>
      
      <main id="main-content">
        <h1 className="sr-only">NC News - Latest Articles</h1>
        
        <section 
          className="articles-grid"
          role="region"
          aria-label="Latest news articles"
          aria-describedby="articles-description"
        >
          <div id="articles-description" className="sr-only">
            A grid of {articles.length} latest news articles. Use arrow keys to navigate.
          </div>
          
          {articles.map((article, index) => (
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

export default HomePage;