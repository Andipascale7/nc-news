import { useState } from "react";
import axios from "axios";

function CommentForm({ article_id, addComment }) {
  const [commentBody, setCommentBody] = useState("");
  const [username, setUsername] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!username.trim()) {
      setPostError("Please enter your username");
      return;
    }
    if (!commentBody.trim()) {
      setPostError("Comment cannot be empty");
      return;
    }
    setIsPosting(true);
    setPostError(null);
    axios
      .post(
        `https://nc-news-api-f09o.onrender.com/api/articles/${article_id}/comments`,
        {
          username: username,
          body: commentBody,
        }
      )
      .then((response) => {
        addComment(response.data.comment);
        setUsername("");
        setCommentBody("");
        setSuccessMsg("Comment posted!");
        setTimeout(() => setSuccessMsg(null), 3000);
      })
      .catch((err) => {
        console.error(err);
        setPostError("Failed to post comment. Try again.");
      })
      .finally(() => {
        setIsPosting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        username:
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isPosting}
        />
      </label>
      <br />
      <label>
        {" "}
        Add a comment:
        <textarea
          value={commentBody}
          onChange={(event) => setCommentBody(event.target.value)}
          disabled={isPosting}
        />
      </label>
      <br />
      <button type="submit" disabled={isPosting}>
        {isPosting ? "Posting..." : "Post Comment"}
      </button>
      {postError && <p>{postError}</p>}
      {successMsg && <p>{successMsg}</p>}
    </form>
  );
}

export default CommentForm;
