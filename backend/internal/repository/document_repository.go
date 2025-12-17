package repository

import (
	"approval-system/internal/model"
	"gorm.io/gorm"
)

type DocumentRepository interface {
	FindAll() ([]model.Document, error)
	BulkUpdate(ids []uint, status string, reason string) (int64, error)
}

type documentRepository struct {
	db *gorm.DB
}

func NewDocumentRepository(db *gorm.DB) DocumentRepository {
	return &documentRepository{db: db}
}

func (r *documentRepository) FindAll() ([]model.Document, error) {
	var docs []model.Document
	err := r.db.Order("id asc").Find(&docs).Error
	return docs, err
}

func (r *documentRepository) BulkUpdate(
	ids []uint,
	status string,
	reason string,
) (int64, error) {

	result := r.db.Model(&model.Document{}).
		Where("id IN ? AND status = ?", ids, "pending").
		Updates(map[string]interface{}{
			"status": status,
			"action_reason": reason,
		})

	return result.RowsAffected, result.Error
}
