import React from 'react';
import PropTypes from 'prop-types';

const PollPage = ({ match }) => <p>Poll Page for pollid: {match.params.id}</p>;

PollPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default PollPage;
