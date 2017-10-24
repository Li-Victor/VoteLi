import { FETCH_USER, NEW_POLL } from '../types';
import api from '../api';

// action creators
export const fetchUser = res => ({
  type: FETCH_USER,
  payload: res.data
});

export const newPoll = res => ({
  type: NEW_POLL,
  payload: res.data
});

// dispatchers
export const makeNewPoll = newPollInfo => dispatch =>
  api.user.makeNewPoll(newPollInfo).then((res) => {
    console.log(res);
    dispatch(newPoll(res));
    return res;
  });
