package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"github.com/metagate-io/mg/app"
	"github.com/metagate-io/mg/config"
	"github.com/metagate-io/mg/infra"
	"github.com/metagate-io/sso-service/orm"
)

// authResponse represents auth data (access /
// refresh tokens) response for a client.
type authResponse struct {
	TokenType    string    `json:"token_type"`
	AccessToken  string    `json:"access_token"`
	RefreshToken string    `json:"refresh_token"`
	Claim        claimData `json:"claim"`
	ExpiresAt    int64     `json:"expires_at"`
}

func (r authResponse) cookieName() string {
	if r.Claim.Context == merchantSite {
		return config.Config().AuthCookieMerchantSite
	}
	return config.Config().AuthCookieOfficeSite
}

func (r authResponse) cookieDomain() string {
	url := config.Config().OfficeSiteUrl
	if r.Claim.Context == merchantSite {
		url = config.Config().MerchantSiteUrl
	}
	url = strings.ReplaceAll(url, "http://", "")
	url = strings.ReplaceAll(url, "https://", "")
	return url
}

// respClaim is the response jwt claim.
type respClaim struct {
	*jwt.StandardClaims
	claimData
}

// claimData is the jwt claim payload.
type claimData struct {
	Context    authContext `json:"context"`
	MerchantID string      `json:"mid"`
	Email      string      `json:"email"`
	FirstName  string      `json:"firstName"`
	LastName   string      `json:"lastName"`
	Title      string      `json:"title"`
	PicUrl     string      `json:"picUrl"`
	IsManager  string      `json:"isManager"`
	IsRoot     string      `json:"isRoot"`
	Groups     []string    `json:"groups"`
}

// authContext tells which site
// the user is logged-in to.
type authContext string

const (
	officeSite   authContext = "office"
	merchantSite authContext = "merchant"
)

// createAuthResponse creates JWT
// token with user data for
// a client side
func createAuthResponse(repo *infra.CrudRepository, cs app.CommonSecrets, u orm.User, authCtx authContext,
	merchantID string, title string, isManager, isRoot bool, picUrl string) (authResponse, error) {
	//
	// Create new refresh token
	refreshToken, err := createRefreshToken(u, repo.Db, cs)
	if err != nil {
		return authResponse{}, err
	}
	//
	// set expiration
	expiresAt := time.Now().Add(time.Minute * 30).Unix()
	//
	// build the payload (claim)
	groups, err := userGroups(repo, u.ID)
	if err != nil {
		groups = make([]string, 0)
	}
	claim := claimData{
		Context:    authCtx,
		MerchantID: merchantID,
		Email:      u.Email,
		FirstName:  u.FirstName,
		LastName:   u.LastName,
		Title:      title,
		PicUrl:     picUrl,
		IsManager:  strconv.FormatBool(isManager),
		IsRoot:     strconv.FormatBool(isRoot),
		Groups:     groups,
	}

	//
	// Convert boolean values
	// to string to use them
	// in token generation
	//
	// Create token (hs256 signature)
	newToken := jwt.New(jwt.SigningMethodHS256)
	newToken.Claims = &respClaim{
		&jwt.StandardClaims{
			ExpiresAt: expiresAt,
		},
		claim,
	}
	//
	secret := []byte(cs.JwtSecret)
	token, err := newToken.SignedString(secret)
	if err != nil {
		return authResponse{}, err
	}
	//
	return authResponse{
		AccessToken:  token,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		Claim:        claim,
		ExpiresAt:    expiresAt,
	}, nil
}

// createResponse takes authResponse and returns it
// in form of a cookie + response body.
// accessToken is transported over an HttpOnly &
// Secure cookie while refreshToken is returned in
// the response (json) body.
func createResponse(c echo.Context, data authResponse) error {
	// store access token with (httpOnly & secure) cookies
	cookie := http.Cookie{
		Name:     data.cookieName(),
		Value:    data.AccessToken,
		Expires:  time.Now().Add(30 * time.Minute),  // access token expiration
		Domain:   data.cookieDomain(),               // cookie domain
		Path:     "/",                               // cookie path within the domain
		HttpOnly: true,                              // could not be extracted using JavaScript (prevents XSS)
		Secure:   config.Config().Env != config.Dev, // transported over HTTPS only (except on dev)
	}

	// set the cookie on the request
	c.SetCookie(&cookie)

	// return refresh token in response for client to store in local storage
	return c.JSON(http.StatusOK, map[string]interface{}{
		"claim":        data.Claim,
		"expires":      data.ExpiresAt,
		"refreshToken": data.RefreshToken,
	})
}

func errResp(e interface{}) map[string]interface{} {
	return map[string]interface{}{"error": fmt.Sprintf("%v", e)}
}
