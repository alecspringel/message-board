import React, { createContext, useState } from "react";

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

/* USER CONTEXT
{
  "_id": "115987172556120960410",
  "anonymousId": "7hzfKLnMhjCZn8UtjKJXGJy",
  "email": "user.email@email.com",
  "first": "First Name",
  "last": "Last Name",
  "picture": "url to the user profile image",
  "courses": [],
  "_cls": "mongo.User"
}
*/

function UserProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={userDetails}>
      <UserDispatchContext.Provider value={setUserDetails}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext, UserDispatchContext };
