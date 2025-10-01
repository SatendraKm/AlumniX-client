export const host = `${import.meta.env.VITE_API_HOST_URL}`;
export const loginRoute = "/users/login";
export const registerRoute = "/users/register";
export const logoutRoute = `${host}/users/logout`;
export const allUsersRoute = "/users/get-all-users";
export const sendMessageRoute = "/messages/addmsg";
export const receiveMessageRoute = "/messages/getmsg";
export const setAvatarRoute = `${host}/api/auth/setavatar`;
