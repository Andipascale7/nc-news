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
  const [readingProgress, setReadingProgress] = useState(0);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

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

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.title || "Check out this article";
    
    const shareUrls = {
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const calculateReadingTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) return <ErrorApp message={error} />;
  if (!article) return <div className="loading">Loading article, please wait...</div>;

  const readingTime = calculateReadingTime(article.body);

  return (
    <>
      <div className="reading-progress">
        <div 
          className="reading-progress-bar" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="professional-article">
        <header className="professional-article-header">
          <div className="article-category">{article.topic.toUpperCase()}</div>
          
          <h1 className="professional-headline">{article.title}</h1>
          
          <div className="professional-byline">
            <span className="byline-author">By {article.author}</span>
            <time className="byline-date">{formatDate(article.created_at)}</time>
            <span className="reading-time">{readingTime} min read</span>
          </div>
        </header>

        <div className="article-hero">
          <img 
            src={article.article_img_url} 
            alt={`Illustration for ${article.title}`}
            className="professional-hero-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=Image+Not+Available';
            }}
          />
          </div>
        <div className="professional-content">
          {article.body.split('\n').map((paragraph, index) => (
            <p key={index} className="professional-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="social-sharing">
          <h4>Share this article</h4>
          <div className="share-buttons">
            <button className="share-btn linkedin" onClick={() => shareArticle('linkedin')}>
              💼 LinkedIn
            </button>
            <button className="share-btn facebook" onClick={() => shareArticle('facebook')}>
              📘 Facebook
            </button>
            <button className="share-btn print" onClick={() => window.print()}>
              🖨️ Print
            </button>
          </div>
        </div>

        <section className="professional-engagement">
          <h3 className="engagement-title">Was this article helpful?</h3>
          <p className="engagement-subtitle">
            Your feedback helps us create better content for the developer community
          </p>
          <Voting article_id={article_id} initialVotes={article.votes} />
        </section>

        <section className="author-bio-section">
          <div className="author-bio-header">
            <div className="author-avatar-large">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div className="author-info">
              <h4 className="author-name">{article.author}</h4>
              <div className="author-role">Contributing Writer</div>
            </div>
          </div>
          <p className="author-description">
            {article.author} is a contributing writer specializing in {article.topic} and modern web development. 
            With years of experience in the field, they bring practical insights and real-world expertise to complex topics.
          </p>
        </section>

        <section className="newsletter-signup">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-subtitle">
            Get the latest articles on web development and technology delivered to your inbox
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        </section>
      </article>

      <section className="professional-comments-section">
        <div className="comments-header-professional">
          <h2 className="comments-title-professional">Discussion</h2>
          <p className="comments-count-professional">
            Join the conversation ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
          </p>
        </div>

        <div className="comment-form-professional">
          <CommentForm 
            article_id={article_id} 
            addComment={addComment} 
            loggedInUser={loggedInUser} 
          />
        </div>

        <div className="comments-list-professional">
          <CommentsList
            comments={comments}
            isLoading={commentsLoading}
            error={commentsError}
            loggedInUser={loggedInUser}
          />
        </div>
      </section>
    </>
  );
}

export default ArticleCard;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useContext } from "react";
// import UserContext from "./UserContext"
// import axios from "axios";
// import CommentsList from "./CommentsList";
// import Voting from "./Voting";
// import CommentForm from "./CommentForm";
// import ErrorApp from "./ErrorApp";

// function ArticleCard() {
//   const { article_id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [commentsError, setCommentsError] = useState(null);
//   const [commentsLoading, setCommentsLoading] = useState(true);
//   const { loggedInUser } = useContext(UserContext);

//   useEffect(() => {
//     axios
//       .get(`https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`)
//       .then((response) => {
//         setArticle(response.data.article);
//       })
//       .catch((err) => {
//         setError("Article not found, try again");
//         console.error(err);
//       });

//     axios
//       .get(
//         `https://nc-news-api-f09o.onrender.com/api/articles/${article_id}/comments`
//       )
//       .then((response) => {
//         if (response.data.comments.length === 0) {
//           setComments([]);
//         } else {
//           setComments(response.data.comments);
//         }
//         setCommentsLoading(false);
//       })
//       .catch((err) => {
//         setCommentsError("Failed to fetch comments");
//         console.error(err);
//         setCommentsLoading(false);
//       });
//   }, [article_id]);

//   const addComment = (newComment) => {
//     setComments((currComments) => [newComment, ...currComments]);
//   };

//   if (error) return <ErrorApp message={error} />;
//   if (!article) return <div className="loading">Loading article, please wait...</div>;

 
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-UK', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="container fade-in">
//       <article className="article-full">
//         <header className="article-header">
//           <div className="article-topic-badge">
//             <span className="article-topic">{article.topic}</span>
//           </div>
          
//           <h1 className="article-full-title">{article.title}</h1>
          
//           <div className="article-meta-full">
//             <div className="author-info">
//               <div className="author-avatar">
//                 {article.author.charAt(0).toUpperCase()}
//               </div>
//               <div className="author-details">
//                 <span className="article-author">By {article.author}</span>
//                 <span className="article-date">
//                   Published {formatDate(article.created_at)}
//                 </span>
//               </div>
//             </div>
            
//             <div className="article-stats-full">
//               <div className="stat-item">
//                 <span className="stat-icon">👍</span>
//                 <span className="stat-value">{article.votes}</span>
//                 <span className="stat-label">votes</span>
//               </div>
//               <div className="stat-item">
//                 <span className="stat-icon">💬</span>
//                 <span className="stat-value">{article.comment_count}</span>
//                 <span className="stat-label">comments</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="article-image-container">
//           <img
//             src={article.article_img_url}
//             alt={`Illustration for ${article.title}`}
//             className="article-image"
//             onError={(e) => {
//               e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=Image+Not+Available';
//             }}
//           />
//         </div>


//         <div className="article-content-full">
//           <div className="article-body">
//             {article.body.split('\n').map((paragraph, index) => (
//               <p key={index} className="article-paragraph">
//                 {paragraph}
//               </p>
//             ))}
//           </div>


//           <div className="voting-section">
//             <h3 className="section-title">Was this article helpful?</h3>
//             <Voting article_id={article_id} initialVotes={article.votes} />
//           </div>
//         </div>
//       </article>


//       <section className="comments-section">
//         <div className="comments-header">
//           <h2 className="section-title">
//             Discussion ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
//           </h2>
//           <p className="section-subtitle">
//             Join the conversation and share your thoughts
//           </p>
//         </div>


//         <div className="comment-form-container">
//           <h3 className="form-title">Add your comment</h3>
//           <CommentForm 
//             article_id={article_id} 
//             addComment={addComment} 
//             loggedInUser="jessjelly" 
//           />
//         </div>


//         <div className="comments-list-container">
//           <CommentsList
//             comments={comments}
//             isLoading={commentsLoading}
//             error={commentsError}
//             loggedInUser="jessjelly"
//           />
//         </div>
//       </section>
//     </div>
//   );
// }

// export default ArticleCard;

