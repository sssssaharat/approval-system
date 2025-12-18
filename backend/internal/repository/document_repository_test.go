package repository

import (
	"approval-system/internal/model"
	"testing"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)
	db.AutoMigrate(&model.Document{})
	return db
}

func TestBulkUpdate_OnlyPendingShouldBeUpdated(t *testing.T) {
	db := setupTestDB(t)

	db.Create(&model.Document{Title: "A", Status: "pending"})
	db.Create(&model.Document{Title: "B", Status: "approved"})

	repo := NewDocumentRepository(db)

	updated, err := repo.BulkUpdate([]uint{1, 2}, "approved", "ok")

	assert.NoError(t, err)
	assert.Equal(t, int64(1), updated)

	var doc1, doc2 model.Document
	db.First(&doc1, 1)
	db.First(&doc2, 2)

	assert.Equal(t, "approved", doc1.Status)
	assert.Equal(t, "ok", doc1.ActionReason)
	assert.Equal(t, "approved", doc2.Status) // ไม่เปลี่ยน
}
