const initialState = {
  user: null,
  loading: true
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.data
      };
    }
    case 'setUserLoading': {
      return {
        ...state,
        loading: action.data
      };
    }
    default:
      return state;
  }
}
