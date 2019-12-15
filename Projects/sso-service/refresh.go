package main

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	mgorm "github.com/metagate-io/mg/orm"
	"github.com/metagate-io/sso-service/orm"
)

// handleRefreshTokenRequest handles token refresh requests.
func (s SsoService) handleRefreshTokenRequest(c echo.Context) error {

	//
	req := refreshTokenRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, errResp(err.Error()))
	}

	//
	// get hash and try to load token from db
	var tok orm.AuthRefreshToken
	hash := hashRefreshToken(req.Token, []byte(s.commonSecrets.JwtRefreshSalt))
	tokenFound, err := s.CrudRepo().LoadBy("refresh_token", hash, &tok)
	if err != nil {
		// unexpected error
		return errors.New(fmt.Sprintf("error loading refresh token, %v", err))
	}
	// check if token exists in DB
	if !tokenFound {
		s.Logger().Info(fmt.Sprintf("attempted to refresh with unknown refresh token"))
		return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
	}
	//
	// check if token didn't expire
	now := time.Now()
	if tok.ExpiresAt.Before(now) {
		s.Logger().Info(fmt.Sprintf("attempted to refresh with expired refresh token, %v", tok.ExpiresAt))
		return c.JSON(http.StatusForbidden, errResp("expired"))
	}
	//
	// Convert int to string and
	// get user's data
	var user orm.User
	userID := fmt.Sprintf("%v", tok.UserID)
	userFound, err := s.CrudRepo().Load(userID, &user)
	if err != nil {
		// unexpected error
		return errors.New(fmt.Sprintf("error loading user, %v, %v", userID, err))
	}
	if !userFound {
		s.Logger().Error(fmt.Sprintf("refresh: user not found, %v, %v", userID, err))
		return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
	}

	//
	// defaults
	var authCtx authContext
	merchantID := ""
	title := ""
	isManager := false
	isRoot := false
	//
	if user.IsStaff {
		authCtx = officeSite
		isManager = user.IsStaff
		isRoot = user.IsSuperuser
		title = "Zotapay Staff"
	}
	if !user.IsStaff {
		var mu mgorm.MerchantUser
		merchantUserFound, err := s.CrudRepo().LoadBy("user_id", user.ID, &mu)
		if err != nil {
			return errors.New(fmt.Sprintf("error loading merchant user, %v, %v", user.Email, err))
		}
		if !merchantUserFound {
			return errors.New(fmt.Sprintf("merchant user doesn't exist, %v, %v", user.Email, err))
		}
		authCtx = merchantSite
		merchantID = mu.MerchantID
		isManager = mu.IsManager
		isRoot = mu.IsAdmin
		title = mu.Title
	}

	// prepare response and return to client
	authData, err := createAuthResponse(s.CrudRepo(), s.commonSecrets, user, authCtx, merchantID, title, isManager, isRoot, "")
	if err != nil {
		return errors.New(fmt.Sprintf("error creating refresh auth response, %v, %v", user.Email, err))
	}

	s.Logger().Info(fmt.Sprintf("refreshed, %v", user.Email))
	return createResponse(c, authData)
}
