const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching:false,
        error:false,
      }
      case "ADMIRE":
        return {
          ...state,
          user: {
          ...state.user,
          admiring : [...state.user.admiring, action.payload],
        },
      };
      case "DISADMIRE":
        return {
          ...state,
          user: {
          ...state.user,
          admiring : state.user.admiring.filter(
            (admiring) =>admiring !==action.payload)
        },
      };
    default:
      return state;
  } 
};
  
export default AuthReducer;
