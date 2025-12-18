package handler_test

import (
	"approval-system/internal/router"
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

func (m *MockService) GetAll() (interface{}, error) {
	args := m.Called()
	return args.Get(0), args.Error(1)
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
	mockSvc.On("BulkApprove", []uint{1}, "ok").
		Return(int64(1), nil)

	h := NewDocumentHandler(mockSvc)
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
}
func TestApprove_WithoutReason_ShouldReturn400(t *testing.T) {
	gin.SetMode(gin.TestMode)

	mockSvc := new(MockService)
	h := NewDocumentHandler(mockSvc)
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
