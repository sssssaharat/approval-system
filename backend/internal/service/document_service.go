package service

import (
	"errors"

	"approval-system/internal/model"
	"approval-system/internal/repository"
)

type DocumentService interface {
	GetAll() ([]model.Document, error)
	Approve(id uint, remark string) error
	Reject(id uint, remark string) error
}

type documentService struct {
	repo repository.DocumentRepository
}

func NewDocumentService(r repository.DocumentRepository) DocumentService {
	return &documentService{r}
}

func (s *documentService) GetAll() ([]model.Document, error) {
	return s.repo.FindAll()
}

func (s *documentService) Approve(id uint, remark string) error {
	doc, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if doc.Status != "pending" {
		return errors.New("cannot approve non-pending document")
	}

	doc.Status = "approved"
	doc.Remark = remark
	return s.repo.Update(doc)
}

func (s *documentService) Reject(id uint, remark string) error {
	doc, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if doc.Status != "pending" {
		return errors.New("cannot reject non-pending document")
	}

	doc.Status = "rejected"
	doc.Remark = remark
	return s.repo.Update(doc)
}
