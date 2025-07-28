
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from "react";
import UserContext from "./UserContext"
import axios from "axios";
import CommentsList from "./CommentsList";
import Voting from "./Voting";
import CommentForm from "./CommentForm";
import ErrorApp from "./ErrorApp";

function ArticleCard() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsError, setCommentsError] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    axios
      .get(`https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`)
      .then((response) => {
        setArticle(response.data.article);
      })
      .catch((err) => {
        setError("Article not found, try again");
        console.error(err);
      });

    axios
      .get(
        `https://nc-news-api-f09o.onrender.com/api/articles/${article_id}/comments`
      )
      .then((response) => {
        if (response.data.comments.length === 0) {
          setComments([]);
        } else {
          setComments(response.data.comments);
        }
        setCommentsLoading(false);
      })
      .catch((err) => {
        setCommentsError("Failed to fetch comments");
        console.error(err);
        setCommentsLoading(false);
      });
  }, [article_id]);

  const addComment = (newComment) => {
    setComments((currComments) => [newComment, ...currComments]);
  };

  if (error) return <ErrorApp message={error} />;
  if (!article) return <div className="loading">Loading article, please wait...</div>;

 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container fade-in">
      <article className="article-full">
        <header className="article-header">
          <div className="article-topic-badge">
            <span className="article-topic">{article.topic}</span>
          </div>
          
          <h1 className="article-full-title">{article.title}</h1>
          
          <div className="article-meta-full">
            <div className="author-info">
              <div className="author-details">
                <span className="article-author">By {article.author}</span>
                <span className="article-date">
                  Published {formatDate(article.created_at)}
                </span>
              </div>
            </div>
            
            <div className="article-stats-full">
              <div className="stat-item">
                <span className="stat-icon">👍</span>
                <span className="stat-value">{article.votes}</span>
                <span className="stat-label">votes</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💬</span>
                <span className="stat-value">{article.comment_count}</span>
                <span className="stat-label">comments</span>
              </div>
            </div>
          </div>
        </header>

        <div className="article-image-container">
          <img
            src={article.article_img_url}
            alt={`Illustration for ${article.title}`}
            className="article-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=Image+Not+Available';
            }}
          />
        </div>


        <div className="article-content-full">
          <div className="article-body">
            {article.body.split('\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>


          <div className="voting-section">
            <h3 className="section-title">Was this article helpful?</h3>
            <Voting article_id={article_id} initialVotes={article.votes} />
          </div>
        </div>
      </article>


      <section className="comments-section">
        <div className="comments-header">
          <h2 className="section-title">
            Discussion ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
          </h2>
          <p className="section-subtitle">
            Join the conversation and share your thoughts
          </p>
        </div>


        <div className="comment-form-container">
          <h3 className="form-title">Add your comment</h3>
          <CommentForm 
            article_id={article_id} 
            addComment={addComment} 
            loggedInUser="jessjelly" 
          />
        </div>


        <div className="comments-list-container">
          <CommentsList
            comments={comments}
            isLoading={commentsLoading}
            error={commentsError}
            loggedInUser="jessjelly"
          />
        </div>
      </section>
    </div>
  );
}

export default ArticleCard;

