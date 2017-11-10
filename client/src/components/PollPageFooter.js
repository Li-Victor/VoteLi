import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const PollPageFooter = ({ loading, error, ownUserPoll, deletePoll, tweet, pollid }) => {
  const buttonStyle = {
    position: 'fixed',
    margin: '2em',
    bottom: 0,
    left: 0,
    animation: 'back-to-docs 1.5s ease-in-out infinite',
    zIndex: 6
  };

  const style = (
    <style>{`
    @keyframes back-to-docs {
        0% { transform: translateY(0); }
        50% { transform: translateY(0.35em); }
        100% { transform: translateY(0); }
    }
  `}</style>
  );

  return (
    <div style={buttonStyle}>
      {style}
      {!loading &&
        !error &&
        ownUserPoll && (
          <Button id={pollid} negative icon onClick={deletePoll}>
            <Icon name="delete" /> Delete
          </Button>
        )}
      {!loading &&
        !error && (
          <Button color="twitter" onClick={tweet}>
            <Icon name="twitter" /> Share
          </Button>
        )}
    </div>
  );
};

PollPageFooter.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  ownUserPoll: PropTypes.bool.isRequired,
  deletePoll: PropTypes.func.isRequired,
  tweet: PropTypes.func.isRequired,
  pollid: PropTypes.string.isRequired
};

export default PollPageFooter;
