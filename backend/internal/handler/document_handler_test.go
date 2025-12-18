package handler_test

import (
	"approval-system/internal/handler"
	"approval-system/internal/model"
	"approval-system/internal/router"
	"approval-system/internal/service"
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type MockService struct {
	mock.Mock
}

func (m *MockService) GetAll() ([]model.Document, error) {
	args := m.Called()
	return args.Get(0).([]model.Document), args.Error(1)
}

func (m *MockService) BulkApprove(ids []uint, reason string) (int64, error) {
	args := m.Called(ids, reason)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockService) BulkReject(ids []uint, reason string) (int64, error) {
	args := m.Called(ids, reason)
	return args.Get(0).(int64), args.Error(1)
}

func TestApprove_PendingDocument_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockSvc := new(MockService)
	var _ service.DocumentService = mockSvc // ✅ compile-time check

	mockSvc.On("BulkApprove", []uint{1}, "ok").
		Return(int64(1), nil)

	h := handler.NewDocumentHandler(mockSvc)
	r := router.SetupRouter(h)

	body := `{"ids":[1],"reason":"ok"}`
	req, _ := http.NewRequest(
		http.MethodPut,
		"/api/documents/approve",
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestApprove_WithoutReason_ShouldReturn400(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockSvc := new(MockService)
	h := handler.NewDocumentHandler(mockSvc)
	r := router.SetupRouter(h)

	body := `{"ids":[1]}`
	req, _ := http.NewRequest(
		http.MethodPut,
		"/api/documents/approve",
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestReject_PendingDocument_Success(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockSvc := new(MockService)
	var _ service.DocumentService = mockSvc

	mockSvc.On("BulkReject", []uint{1}, "not ok").
		Return(int64(1), nil)

	h := handler.NewDocumentHandler(mockSvc)
	r := router.SetupRouter(h)

	body := `{"ids":[1],"reason":"not ok"}`
	req, _ := http.NewRequest(
		http.MethodPut,
		"/api/documents/reject",
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	mockSvc.AssertExpectations(t)
}

func TestReject_WithoutReason_ShouldReturn400(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockSvc := new(MockService)
	h := handler.NewDocumentHandler(mockSvc)
	r := router.SetupRouter(h)

	body := `{"ids":[1]}`
	req, _ := http.NewRequest(
		http.MethodPut,
		"/api/documents/reject",
		bytes.NewBufferString(body),
	)
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}
