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
  if (!article) return <p>Loading article, please wait...</p>;

  return (
    <div>
      <h2>{article.title}</h2>
      <img
        src={article.article_img_url}
        alt={`Thumbnail for ${article.title}`}
      />
      <p>
        <strong>By:</strong> {article.author}
      </p>
      <p>{article.body}</p>
      <Voting article_id={article_id} initialVotes={article.votes} />
      <p>
        <strong>Comments:</strong> {article.comment_count}
      </p>
      <CommentForm article_id={article_id} addComment={addComment} loggedInUser="jessjelly" />
      <CommentsList
        comments={comments}
        isLoading={commentsLoading}
        error={commentsError}
        loggedInUser="jessjelly"
      />
    </div>
  );
}

export default ArticleCard;
