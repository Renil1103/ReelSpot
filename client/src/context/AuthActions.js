export const LoginStart = (userCredentials) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
}); 

export const Logout = () => ({
  type: "LOGOUT",
})

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Admire = (userId) => ({
  type: "ADMIRE",
  payload: userId,
});

export const Disadmire = (userId) => ({
  type: "DISADMIRE",
  payload: userId,
});