package service

import (
	"approval-system/internal/model"
	"approval-system/internal/repository"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockRepo struct {
	mock.Mock
}

func (m *MockRepo) FindAll() ([]model.Document, error) {
	args := m.Called()
	return args.Get(0).([]model.Document), args.Error(1)
}

func (m *MockRepo) BulkUpdate(ids []uint, status string, reason string) (int64, error) {
	args := m.Called(ids, status, reason)
	return args.Get(0).(int64), args.Error(1)
}

func TestBulkApprove_ShouldSendApprovedStatus(t *testing.T) {
	repo := new(MockRepo)
	var _ repository.DocumentRepository = repo // ✅ compile-time safety check

	service := NewDocumentService(repo)

	repo.On("BulkUpdate", []uint{1}, "approved", "ok").
		Return(int64(1), nil)

	updated, err := service.BulkApprove([]uint{1}, "ok")

	assert.NoError(t, err)
	assert.Equal(t, int64(1), updated)
	repo.AssertExpectations(t)
}
func TestGetAll_ShouldReturnDocuments(t *testing.T) {
	repo := new(MockRepo)
	service := NewDocumentService(repo)

	docs := []model.Document{
		{ID: 1, Title: "Doc1", Status: "pending"},
	}

	repo.On("FindAll").
		Return(docs, nil)

	result, err := service.GetAll()

	assert.NoError(t, err)
	assert.Len(t, result, 1)
	assert.Equal(t, "Doc1", result[0].Title)
}
