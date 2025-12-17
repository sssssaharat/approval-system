package handler

import (
	"approval-system/internal/dto"
	"approval-system/internal/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type DocumentHandler struct {
	service service.DocumentService
}

func NewDocumentHandler(s service.DocumentService) *DocumentHandler {
	return &DocumentHandler{
		service: s,
	}
}

func (h *DocumentHandler) GetAll(c *gin.Context) {
	res, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *DocumentHandler) BulkApprove(c *gin.Context) {
	var req dto.BulkActionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.service.BulkApprove(req.IDs, req.Reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"updated": updated})
}

func (h *DocumentHandler) BulkReject(c *gin.Context) {
	var req dto.BulkActionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.service.BulkReject(req.IDs, req.Reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"updated": updated})
}
