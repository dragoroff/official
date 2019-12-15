package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/metagate-io/mg/app"

	"github.com/labstack/echo/v4"
	"github.com/metagate-io/mg/config"
	"github.com/metagate-io/mg/events"
	mgorm "github.com/metagate-io/mg/orm"
	"github.com/metagate-io/mg/util"
	"github.com/metagate-io/mg/util/hasher"
	"github.com/metagate-io/sso-service/orm"
)

// handleMerchantAuth handles an authentication request from a merchant-site client,
// which can authenticate either with user/password credentials or with google sign in.
func (s SsoService) handleMerchantAuth(c echo.Context) error {

	// parse request
	req := authRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, errResp(err.Error()))
	}

	// first check for google token.
	if req.Token != "" {
		return s.handleMerchantTokenAuth(c, req)
	}

	// fallback to user/pass credentials.
	return s.handleMerchantCredentialsAuth(c, req)
}

func (s SsoService) handleMerchantTokenAuth(c echo.Context, req authRequest) error {

	// Get user's personal details
	info, err := getGoogleUserInfo(s.client, req.Token)
	if err != nil {
		return errors.New(fmt.Sprintf("error parsing google user info, %v", err))
	}

	// try to load user from db
	var user orm.User
	userFound, err := s.CrudRepo().LoadBy("email", info.Email, &user)
	if err != nil {
		// unexpected error
		return errors.New(fmt.Sprintf("error loading user by email, %v, %v", info.Email, err))
	}
	if !userFound {
		s.Logger().Warning(fmt.Sprintf("unauthorized attempt, %v, %v", info.Email, util.ToJson(info)))
		return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
	}

	//
	merchantID := ""
	title := ""
	isManager := false
	isAdmin := false
	//
	var mu mgorm.MerchantUser
	merchantUserFound, err := s.CrudRepo().LoadBy("user_id", user.ID, &mu)
	if err != nil {
		return errors.New(fmt.Sprintf("error loading merchant user, %v, %v", info.Email, err))
	}
	if merchantUserFound {
		merchantID = mu.MerchantID
		title = mu.Title
		isManager = mu.IsManager
		isAdmin = mu.IsAdmin
	}
	if !merchantUserFound {
		if user.IsStaff && req.Username != "" {
			// admin hack to login as merchant
			merchantID = req.Username
			title = "Administrator"
			isManager = true
			isAdmin = true
		} else {
			s.Logger().Warning(fmt.Sprintf("merchant user doesn't exist, %v, %v", info.Email, err))
			return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
		}
	}

	// Check if user verified by google
	isEmailVerified, err := strconv.ParseBool(info.EmailVerified)
	if err != nil {
		// cannot parse string to bool - shouldn't really happen
		return errors.New(fmt.Sprintf("unable to convert string -> bool, %v, %v", info.EmailVerified, err))
	}
	if !isEmailVerified {
		s.Logger().Info(fmt.Sprintf("known user but email not-verified, %v, %v", info.Email, util.ToJson(info)))
		return c.JSON(http.StatusForbidden, errResp("unverified"))
	}

	// prepare response and return to client
	authData, err := createAuthResponse(s.CrudRepo(), s.commonSecrets, user, merchantSite, merchantID, title, isManager, isAdmin, info.Picture)
	if err != nil {
		return errors.New(fmt.Sprintf("error creating auth response, %v, %v", info.Email, err))
	}
	s.Logger().Info(fmt.Sprintf("authenticated, %v", user.Email))

	// publish UserSignedIn
	u := User{Model: app.ID(info.Email)}
	u.Apply(events.UserSignedIn{
		Event:   events.ForID(info.Email),
		Context: string(merchantSite),
		Method:  "token",
		Mid:     merchantID,
		At:      util.FormatTime(time.Now()),
	})
	if err := s.Repo().Save(&u, config.Config().TopicOffice); err != nil {
		// fail silently
		s.Logger().Warning("error storing UserSignedIn event, user %v, %v", info.Email, err)
	}

	return createResponse(c, authData)
}

func (s SsoService) handleMerchantCredentialsAuth(c echo.Context, req authRequest) error {

	var user orm.User
	userFound, err := s.CrudRepo().LoadBy("email", req.Username, &user)
	if err != nil {
		return errors.New(fmt.Sprintf("error loading user by credentials, %v, %v", req.Username, err))
	}
	if !userFound {
		s.Logger().Warning(fmt.Sprintf("unauthorized credentials attempt, %v", req.Username))
		return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
	}

	var mu mgorm.MerchantUser
	hashedPass := hashPassword(req.Password, []byte(s.commonSecrets.JwtRefreshSalt))
	if res := s.CrudRepo().Db.Where("user_id = ? and hashed_password = ?", user.ID, hashedPass).First(&mu); res.Error != nil {
		if res.RecordNotFound() {
			s.Logger().Warning(fmt.Sprintf("invalid user / password, %v, %v", req.Username, err))
			return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
		}
		return errors.New(fmt.Sprintf("error loading merchant user, %v, %v", req.Username, err))
	}

	// prepare response and return to client
	authData, err := createAuthResponse(s.CrudRepo(), s.commonSecrets, user, merchantSite, mu.MerchantID, mu.Title, mu.IsManager, mu.IsAdmin, "")
	if err != nil {
		return errors.New(fmt.Sprintf("error creating merchant auth response, %v, %v", req.Username, err))
	}
	s.Logger().Info(fmt.Sprintf("merchant authenticated, %v", req.Username))

	// publish UserSignedIn
	u := User{Model: app.ID(req.Username)}
	u.Apply(events.UserSignedIn{
		Event:   events.ForID(req.Username),
		Context: string(merchantSite),
		Method:  "credentials",
		Mid:     mu.MerchantID,
		At:      util.FormatTime(time.Now()),
	})
	if err := s.Repo().Save(&u, config.Config().TopicOffice); err != nil {
		// fail silently
		s.Logger().Warning("error storing UserSignedIn event, user %v, %v", req.Username, err)
	}

	return createResponse(c, authData)
}

func hashPassword(pass string, salt []byte) string {
	return hasher.Pbkdf2Hash([]byte(pass), salt)
}
