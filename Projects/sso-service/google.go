package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// getGoogleUserInfo attempts to
// convert a token to a userInfo struct.
func getGoogleUserInfo(c *http.Client, t string) (userInfo, error) {
	url := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?id_token=%s", t)
	var ui userInfo
	err := getJSON(c, url, &ui)
	if err != nil {
		return ui, err
	}
	return ui, nil
}

// userInfo represents a response from
// google to a token verification request.
type userInfo struct {
	Email         string `json:"email"`
	EmailVerified string `json:"email_verified"`
	AtHash        string `json:"at_hash"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
}

// getJSON requests google's api url and
// attempts to convert the response into
// a userInfo struct.
func getJSON(c *http.Client, url string, target interface{}) error {
	r, err := c.Get(url)
	if err != nil {
		return err
	}
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(target)
}
