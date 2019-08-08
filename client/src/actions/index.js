import { AUTH_USER, INCREMENT_COUNTER, DECREMENT_COUNTER } from './types';
import axios from 'axios';


export const increment = () => {
  return { type: INCREMENT_COUNTER };
};

export const decrement = () => {
  return { type: DECREMENT_COUNTER };
};


export const signin = () => async dispatch => {
  // By default, actions can only return objects
  // redux thunk allows us to return whatever we want
  // We can dispatch as many actions as we want as we now have access to dispatch
  // We can also make async requests inside of our actions thanks to redux-thunk
  try {
    const res = await axios.get('http://localhost:3001/auth/user');
    // We are getting our token back from res.data.token
    // We want to send this token to our reducer
    console.log(res.data)

    dispatch({ type: AUTH_USER, payload: res.data });
    localStorage.setItem('token', res.data);
    // callback();
  } catch(e) {
    // callback()
    console.log(e);
    // dispatch({ type: AUTH_ERROR, payload: 'Invalid login credentials' });
  }

};


export const signout = () => {
  localStorage.removeItem('token');
  return {
    type: AUTH_USER,
    payload: ''
  };
};


