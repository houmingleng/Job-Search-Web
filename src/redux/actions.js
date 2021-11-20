import axios from 'axios';

export const setUser = user => ({
  type: 'setUser',
  data: user
});

export const setUserLoading = loading => ({
  type: 'setUserLoading',
  data: loading
});

export const fetchUser = () => dispatch => {
  dispatch(setUserLoading(true));
  axios.post('/api/auth/current')
    .then(res => {
      const user = res.data;
      if (user) {
        dispatch(setUser(user));
      }
      dispatch(setUserLoading(false));
    });
};
