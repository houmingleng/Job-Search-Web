import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function () {
  const user = useSelector(state => state.user.user);
  const loading = useSelector(state => state.user.loading);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // console.log(user, loading)
    if (!user && !loading) {
      const back = location.pathname + location.search;
      history.push('/login?back=' + encodeURIComponent(back));
    }
  }, [loading, user, history, location]);
}