import axios from 'axios';

export default {
  user: {
    login: () => axios.get('/auth/current_user').then(res => res.data),
    makeNewPoll: newPollInfo => axios.post('/api/poll', { newPollInfo })
  },
  poll: {
    getPolls: () => axios.get('/api/poll').then(res => res.data),
    getPollById: id => axios.get(`/api/poll/${id}`).then(res => res.data),
    vote: (pollid, option) => axios.put(`/api/poll/${pollid}`, { option })
  }
};
