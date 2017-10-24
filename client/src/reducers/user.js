import { FETCH_USER, NEW_POLL } from '../types';

export default function user(state = {}, action) {
  switch (action.type) {
    case NEW_POLL:
    case FETCH_USER:
      return action.payload;
    default:
      return state;
  }
}
