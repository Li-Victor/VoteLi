import axios from 'axios';

export default {
  user: {
    login: () => axios.get('/auth/current_user').then(res => res)
  },
  polls: {}
};
