package config

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func ConnectDatabase() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("data/approval.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Cannot connect database:", err)
	}
	return db
}
