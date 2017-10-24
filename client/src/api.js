import axios from 'axios';

export default {
  user: {
    login: () => axios.get('/auth/current_user').then(res => res),
    makeNewPoll: newPollInfo => axios.post('/api/poll', { newPollInfo }).then(res => res)
  },
  polls: {}
};
