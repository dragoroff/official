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
	"github.com/metagate-io/mg/util"
	"github.com/metagate-io/sso-service/orm"
)

// handleOfficeAuth receives an http request
// from a client that signed-in with google
// and got a token.
// this method should reach out to google and get profile
// info in exchange to that token.
// then, Users table in db is checked for a user matching
// the returned profile info.
// if no user found, no sign-in occurs.
func (s SsoService) handleOfficeAuth(c echo.Context) error {
	//
	req := authRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, errResp(err.Error()))
	}

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
	if !userFound || !user.IsStaff {
		s.Logger().Info(fmt.Sprintf("unauthorized attempt, %v, %v", info.Email, util.ToJson(info)))
		return c.JSON(http.StatusUnauthorized, errResp("unauthorized"))
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
	authData, err := createAuthResponse(s.CrudRepo(), s.commonSecrets, user, officeSite, "", "Zotapay Staff", user.IsStaff, user.IsSuperuser, info.Picture)
	if err != nil {
		return errors.New(fmt.Sprintf("error creating auth response, %v, %v", info.Email, err))
	}
	s.Logger().Info(fmt.Sprintf("authenticated, %v", user.Email))

	// publish UserSignedIn
	u := User{Model: app.ID(info.Email)}
	u.SetVersion(-2)
	u.Apply(events.UserSignedIn{
		Event:   events.ForID(info.Email),
		Context: string(officeSite),
		Method:  "token",
		Mid:     "",
		At:      util.FormatTime(time.Now()),
	})
	if err := s.Repo().Save(&u, config.Config().TopicOffice); err != nil {
		// fail silently
		s.Logger().Warning("error storing UserSignedIn event, user %v, %v", info.Email, err)
	}

	return createResponse(c, authData)
}
