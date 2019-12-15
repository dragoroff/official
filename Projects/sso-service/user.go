package main

import (
	"github.com/metagate-io/mg/app"
	"github.com/metagate-io/mg/core"
)

type User struct {
	app.Model
}

func (u *User) On(event core.Event) {
	//
}
