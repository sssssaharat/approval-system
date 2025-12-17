package model

import "time"

type Document struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`  
	Reason    string    `json:"reason"`  
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
