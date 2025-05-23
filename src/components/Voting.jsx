import { useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

function Voting({ article_id, initialVotes, onVoteChange }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voteError, setVoteError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (voteChange) => {
    if (hasVoted) return;
    
    const newVotes = votes + voteChange;
    setVotes(newVotes);
    

    if (onVoteChange) {
      onVoteChange(newVotes);
    }
    
    setHasVoted(true);
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
        
        if (onVoteChange) {
          onVoteChange(revertedVotes);
        }
        
        setHasVoted(false);
        setVoteError("Vote failed. Try again.");
      });
  };

  return (
    <div>
      <p>
        <strong>Votes:</strong> {votes}
      </p>
      <button onClick={() => handleVote(1)} disabled={hasVoted}>
        <FaThumbsUp /> Yahhh!
      </button>
      <button onClick={() => handleVote(-1)} disabled={hasVoted}>
        <FaThumbsDown /> Nahhh!
      </button>
      {voteError && <p>{voteError}</p>}
    </div>
  );
}

export default Voting;
