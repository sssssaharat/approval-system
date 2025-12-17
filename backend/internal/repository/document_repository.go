package repository

import (
	"approval-system/internal/model"
	"gorm.io/gorm"
)

type DocumentRepository interface {
	FindAll() ([]model.Document, error)
	FindByID(id uint) (*model.Document, error)
	Update(doc *model.Document) error
}

type documentRepository struct {
	db *gorm.DB
}

func NewDocumentRepository(db *gorm.DB) DocumentRepository {
	return &documentRepository{db}
}

func (r *documentRepository) FindAll() ([]model.Document, error) {
	var docs []model.Document
	err := r.db.Order("id asc").Find(&docs).Error
	return docs, err
}

func (r *documentRepository) FindByID(id uint) (*model.Document, error) {
	var doc model.Document
	err := r.db.First(&doc, id).Error
	if err != nil {
		return nil, err
	}
	return &doc, nil
}

func (r *documentRepository) Update(doc *model.Document) error {
	return r.db.Save(doc).Error
}
