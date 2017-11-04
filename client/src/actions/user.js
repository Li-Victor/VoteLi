import { FETCH_USER } from '../types';
import api from '../api';

// action creators
export const fetchUser = res => ({
  type: FETCH_USER,
  payload: res
});

// dispatchers
export const makeNewPoll = newPollInfo => dispatch =>
  api.user.makeNewPoll(newPollInfo).then((res) => {
    dispatch(fetchUser(res.data.user));
    return res.data.pollid;
  });

export const deletePoll = pollid => dispatch =>
  api.user.deletePoll(pollid).then((res) => {
    dispatch(fetchUser(res.data.user));
  });
