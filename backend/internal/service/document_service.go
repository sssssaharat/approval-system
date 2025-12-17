package service

import (
	"approval-system/internal/model"
	"approval-system/internal/repository"
)

type DocumentService interface {
	GetAll() ([]model.Document, error)
	BulkApprove(ids []uint, reason string) (int64, error)
	BulkReject(ids []uint, reason string) (int64, error)
}

type documentService struct {
	repo repository.DocumentRepository
}

func NewDocumentService(r repository.DocumentRepository) DocumentService {
	return &documentService{repo: r}
}

func (s *documentService) GetAll() ([]model.Document, error) {
	return s.repo.FindAll()
}

func (s *documentService) BulkApprove(ids []uint, reason string) (int64, error) {
	return s.repo.BulkUpdate(ids, "approved", reason)
}

func (s *documentService) BulkReject(ids []uint, reason string) (int64, error) {
	return s.repo.BulkUpdate(ids, "rejected", reason)
}
