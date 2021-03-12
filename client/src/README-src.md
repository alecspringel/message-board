# SRC

This ReadMe discusses the App.js, index.js, and PrivateRoute.js files.

## App.js

This is the root app entry for the frontend of the project. Here is where every unique webpage is routed through.

```js
function App() {
  return (
    <Router>
      <UserProvider>
        <Switch>
          <PrivateRoute path="/home" exact>
            <NavigationWrapper>
              <Home />
            </NavigationWrapper>
          </PrivateRoute>
          <PrivateRoute path="/" exact>
            <NavigationWrapper>
              <Courses />
            </NavigationWrapper>
          </PrivateRoute>
          <PrivateRoute path="/messages" exact>
            <NavigationWrapper>
              <Messages />
            </NavigationWrapper>
          </PrivateRoute>
          <Route path="/signup" exact>
            <SignUp />
          </Route>
          <Route path="/login" exact>
            <Login />
          </Route>
          <PrivateRoute path="/course/:courseid" exact>
            <NavigationWrapper>
              <ClassView />
            </NavigationWrapper>
          </PrivateRoute>
          <PrivateRoute path="/course/:courseid/post/:postid" exact>
            <NavigationWrapper>
              <CommentView />
            </NavigationWrapper>
          </PrivateRoute>
        </Switch>
      </UserProvider>
    </Router>
  );
}
```

## PrivateRoute.js

PrivateRoute is a wrapper Router to route user data from the backend to each respective webpage wrapped in the PrivateRouter. Here is how the user data is fetched from the backend:

```js
const attemptSignIn = (token) => {
  axios
    .get(process.env.REACT_APP_SERVER_URL + "/api/me", {
      withCredentials: true,
    })
    // User has an active cookie from server, sign in success
    .then((res) => {
      if (res.data && res.data._id) {
        setUser(res.data);
      }
    })
    // No active cookie - redirect to login page
    .catch((err) => {
      console.log("Error completing sign in:", err);
      setUser(false);
    });
};
```

## Index.js

Index.js is the wrapper entry for React to pass the app into the DOM of index.html.

```js
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```
