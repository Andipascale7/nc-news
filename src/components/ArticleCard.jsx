import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCommentsByArticleId } from "../api";
import CommentCard from "./CommentCard";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function ArticleCard() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`)
      .then((response) => {
        setArticle(response.data.article);
        setVotes(response.data.article.votes);
      })
      .catch((err) => {
        setError("Article not found, try again");
        console.error(err);
      });

    getCommentsByArticleId(article_id)
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        setError("Comments not found, try again");
        console.error(err);
      });
  }, [article_id]);

  const handleVote = (voteChange) => {
    setVotes((currentVotes) => currentVotes + voteChange);
    setError(null);
    axios
      .patch(
        `https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`,
        {
          inc_votes: voteChange,
        }
      )
      .catch((err) => {
        setVotes((currentVotes) => currentVotes - voteChange);
        setError("Vote update failed.Please try again");
        console.error(err);
      });
  };

  if (error) return <p>{error}</p>;
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
      <p>
        <strong>Votes:</strong> {votes}
        <button onClick={() => handleVote(1)}>
          <FaThumbsUp />
          Yeahhh!
        </button>
        <button onClick={() => handleVote(-1)}>
          <FaThumbsDown /> Neahhh!
        </button>
      </p>
      <p>
        <strong>Comments:</strong> {article.comment_count}
      </p>

      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <CommentCard comment={comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ArticleCard;
