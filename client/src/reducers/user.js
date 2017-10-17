import { FETCH_USER } from '../types';

export default function user(state = {}, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;
    default:
      return state;
  }
}
