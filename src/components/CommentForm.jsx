import { useState, useContext } from "react";
import { postComment } from "../api";
import UserContext from "./UserContext";

function CommentForm({ article_id, addComment }) {
  const [commentBody, setCommentBody] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { loggedInUser } = useContext(UserContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!commentBody.trim()) {
      setPostError("Comment cannot be empty");
      return;
    }

    setIsPosting(true);
    setPostError(null);

    postComment(article_id, loggedInUser, commentBody)
      .then((response) => {
        addComment(response.data.comment);
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
      <p>
        Commenting as <strong>{loggedInUser}</strong>
      </p>
      <label>
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
