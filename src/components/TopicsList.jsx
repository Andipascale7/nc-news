import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function TopicsList() {
  const [topics, setTopics] = useState([]);
  const [topicArticles, setTopicArticles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    Promise.all([
      axios.get('https://nc-news-api-f09o.onrender.com/api/topics'),
      axios.get('https://nc-news-api-f09o.onrender.com/api/articles')
    ])
    .then(([topicsResponse, articlesResponse]) => {
      const topicsData = topicsResponse.data.topics;
      const articlesData = articlesResponse.data.articles;
      

      const articlesByTopic = {};
      topicsData.forEach(topic => {
        const topicArticles = articlesData.filter(article => article.topic === topic.slug);
        articlesByTopic[topic.slug] = {
          count: topicArticles.length,
          latestArticle: topicArticles[0] || null
        };
      });
      
      setTopics(topicsData);
      setTopicArticles(articlesByTopic);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="loading">Loading topics...</div>;
  }

  return (
    <div className="topics-page">
<div className="topics-intro">
  <p className="topics-subtitle">Browse our coverage areas</p>
</div>
      
      <div className="topics-grid">
        {topics.map((topic) => {
          const articleData = topicArticles[topic.slug];
          const latestArticle = articleData?.latestArticle;
          
          return (
            <Link 
              key={topic.slug} 
              to={`/topics/${topic.slug}`}
              className="topic-card-link"
            >
              <article className="topic-card">
                <div className="topic-image-wrapper">
                  {latestArticle ? (
                    <img
                      src={latestArticle.article_img_url}
                      alt=""
                      className="topic-card-image"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x250/667eea/ffffff?text=${topic.slug.toUpperCase()}`;
                      }}
                    />
                  ) : (
                    <div className="topic-placeholder">
                      <span className="topic-icon">📰</span>
                    </div>
                  )}
                  <div className="topic-overlay">
                    <span className="topic-badge">{topic.slug}</span>
                  </div>
                </div>
                
                <div className="topic-content">
                  <h3 className="topic-name">{topic.slug}</h3>
                  <p className="topic-description">{topic.description}</p>
                  
                  {latestArticle && (
                    <div className="latest-article">
                      <h4 className="latest-title">Latest:</h4>
                      <p className="latest-headline">{latestArticle.title}</p>
                      <span className="latest-author">By {latestArticle.author}</span>
                    </div>
                  )}
                  
                  <div className="topic-stats">
                    <span className="article-count">
                      {articleData?.count || 0} article{articleData?.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TopicsList;

