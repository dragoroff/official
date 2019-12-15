package main

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/metagate-io/mg/app"
	"github.com/metagate-io/mg/infra"
	"github.com/metagate-io/mg/util/hasher"
	"github.com/metagate-io/sso-service/orm"
)

// createRefreshToken adds refresh
// token to DB and returns
// a new token
func createRefreshToken(user orm.User, db *gorm.DB, cs app.CommonSecrets) (string, error) {
	//
	// Set expiration date of refresh token
	expiresAt := time.Now().Add(time.Hour * 12) // 12 hours
	//
	// Create new refresh token and hash.
	// Return token to client and save hash
	// in DB
	refreshToken := uuid.New().String()
	hash := hashRefreshToken(refreshToken, []byte(cs.JwtRefreshSalt))
	// Gorm Request for creation a new token in DB
	createReq := &orm.AuthRefreshToken{
		User:         user,
		RefreshToken: hash,
		ExpiresAt:    expiresAt,
	}
	//
	var token orm.AuthRefreshToken
	//
	// Find refresh token
	// related to user in DB
	// If found --> Delete and Create new
	// if not --> Create new
	//
	res := db.Model(&user).Related(&token)
	if res.Error != nil {
		if res.RecordNotFound() {
			// Add refresh token to DB
			if res := db.Create(createReq); res.Error != nil {
				return "", res.Error
			}
			//
			return refreshToken, nil
		}
		// Unexpected error occured
		return "", res.Error
	}

	// init db transaction
	tx := db.Begin()

	// If it exists, delete token
	// and create a new one
	if err := db.Delete(&token).Error; err != nil {
		// Unexpected error occured
		tx.Rollback()
		return "", err
	}
	if res := db.Create(createReq); res.Error != nil {
		tx.Rollback()
		return "", res.Error
	}

	tx.Commit()
	return refreshToken, nil
}

// userGroups returns a slice of group
// names that a given user is in, or an error.
func userGroups(repo *infra.CrudRepository, userID int) ([]string, error) {
	var userGroups []orm.UserGroups
	found, err := repo.LoadManyBy("user_id", fmt.Sprintf("%v", userID), &userGroups)
	if err != nil {
		return nil, err
	}
	ret := make([]string, 0)
	if !found {
		return ret, nil
	}
	for _, ug := range userGroups {
		var g orm.Group
		found, err := repo.Load(fmt.Sprintf("%v", ug.GroupID), &g)
		if err != nil {
			return nil, err
		}
		if !found {
			continue
		}
		ret = append(ret, g.Name)
	}
	return ret, nil
}

// hashRefreshToken hashes
// new refresh token using
// a pbkdf2 salted hash.
func hashRefreshToken(tok string, salt []byte) string {
	return hasher.Pbkdf2Hash([]byte(tok), salt)
}
