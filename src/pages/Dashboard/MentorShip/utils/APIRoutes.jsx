export const host = "https://n-square.onrender.com";
export const loginRoute = `/users/login`;
export const registerRoute = `/users/register`;
export const logoutRoute = `${host}/users/logout`;
// export const allUsersRoute = `${host}/api/auth/allusers`;
export const allUsersRoute = "/users/get-all-users";
// export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const sendMessageRoute = `/messages/addmsg`;

// export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const recieveMessageRoute = `/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;

//imp routes
export const sendGroupMessageRoute = `/group-message/addmsg`;
export const recieveGroupMessageRoute = `/group-message/getmsg`;
export const allGroupRoutes = "/groups/get-all-groups";
