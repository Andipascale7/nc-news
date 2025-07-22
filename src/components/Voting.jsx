import { useState } from "react";
import axios from "axios";

function Voting({ article_id, initialVotes, onVoteChange }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voteError, setVoteError] = useState(null);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (voteType) => {
    if (userVote === voteType) return;

    let voteChange;
    if (userVote === null) {
      voteChange = voteType === "helpful" ? 1 : -1;
    } else {
      voteChange = voteType === "helpful" ? 2 : -2;
    }

    const newVotes = votes + voteChange;
    setVotes(newVotes);
    setUserVote(voteType);

    if (onVoteChange) {
      onVoteChange(newVotes);
    }

    setVoteError(null);

    axios
      .patch(
        `https://nc-news-api-f09o.onrender.com/api/articles/${article_id}`,
        {
          inc_votes: voteChange,
        }
      )
      .catch((err) => {
        console.error(err);

        const revertedVotes = newVotes - voteChange;
        setVotes(revertedVotes);
        setUserVote(userVote);
        if (onVoteChange) {
          onVoteChange(revertedVotes);
        }
        setVoteError("Vote failed. Please try again.");
      });
  };

  return (
    <div className="professional-voting">
      <div className="voting-actions">
        <button
          className={`vote-btn helpful ${
            userVote === "helpful" ? "voted" : ""
          }`}
          onClick={() => handleVote("helpful")}
        >
          <span className="vote-icon">👍</span>
          {/* <span className="vote-text">Helpful</span> */}
        </button>

        <button
          className={`vote-btn not-helpful ${
            userVote === "not-helpful" ? "voted" : ""
          }`}
          onClick={() => handleVote("not-helpful")}
        >
          <span className="vote-icon">👎</span>
          {/* <span className="vote-text">Not helpful</span> */}
        </button>
      </div>

      <div className="vote-stats">
        <span className="vote-count">{votes} readers found this helpful</span>
      </div>

      {voteError && <div className="vote-error">{voteError}</div>}
    </div>
  );
}

export default Voting;

