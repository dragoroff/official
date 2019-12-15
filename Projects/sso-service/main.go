package main

import (
	"fmt"
	"net/http"
	"reflect"
	"time"

	"github.com/metagate-io/mg/config"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/metagate-io/mg/app"
	"github.com/metagate-io/mg/infra/secrets"
	"github.com/metagate-io/mg/infra/sentry"
)

const (
	apiBaseUrl = "/api/v1"
)

type SsoService struct {
	app.Service
	client        *http.Client
	commonSecrets app.CommonSecrets
}

func main() {

	// init sentry
	if err := sentry.Init(); err != nil {
		panic(fmt.Sprintf("unable to init Sentry, %v", err))
	}

	// init secrets store
	sec := secrets.New(false, false)

	// init http service
	s := SsoService{
		client:        &http.Client{Timeout: 10 * time.Second},
		commonSecrets: app.GetCommonSecrets(sec),
	}

	// setup service
	if err := s.Setup(
		app.WithName(reflect.TypeOf(s).Name()),
		app.WithSecrets(sec),
		app.WithEventsRepo(),
		app.WithCrudRepo(),
		app.WithHttpServer(1323, apiBaseUrl+"/auth/hc/"),
	); err != nil {
		panic(err)
	}

	// CORS
	allowedOrigins := []string{
		"https://office.metagate.io",
		"https://office-sandbox.metagate.io",
		"https://office-stage.metagate.io",
		"https://account.metagate.io",
		"https://account-sandbox.metagate.io",
		"https://account-stage.metagate.io",
	}
	if config.CurrentEnv() == config.Dev {
		allowedOrigins = append(allowedOrigins, "http://office-dev.metagate.io:8080", "http://account-dev.metagate.io:8081")
	}
	s.Server().Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowCredentials: true,
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{echo.GET, echo.POST, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderCookie},
	}))

	// register routes
	s.Server().POST(fmt.Sprintf("%s/auth/office/", apiBaseUrl), s.handleOfficeAuth)
	s.Server().POST(fmt.Sprintf("%s/auth/merchant/", apiBaseUrl), s.handleMerchantAuth)
	s.Server().POST(fmt.Sprintf("%s/auth/refresh/", apiBaseUrl), s.handleRefreshTokenRequest)

	// start http server
	s.Server().Logger.Fatal(s.Start())
}
