package main

// authRequests represents a client authentication request.
// for token based auth Token is populated, for user/password
// auth Username and Password are populated.
type authRequest struct {
	Token    string `json:"token"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// refreshTokenRequest is a key
// that we are getting from client to
// refresh access token
type refreshTokenRequest struct {
	Token string `json:"token"`
}
