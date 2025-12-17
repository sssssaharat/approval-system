package handler

import (
	"approval-system/internal/dto"
	"approval-system/internal/model"
	"approval-system/internal/service"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	// "strconv"
)

type DocumentHandler struct {
	service service.DocumentService
}

//	func NewDocumentHandler(s service.DocumentService) *DocumentHandler {
//		return &DocumentHandler{s}
//	}
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

// func (h *DocumentHandler) Approve(c *gin.Context) {
// 	id, _ := strconv.Atoi(c.Param("id"))
// 	var body struct{ Remark string }

// 	if err := c.ShouldBindJSON(&body); err != nil {
// 		c.JSON(400, gin.H{"error": "invalid request"})
// 		return
// 	}

// 	err := h.service.Approve(uint(id), body.Remark)
// 	if err != nil {
// 		c.JSON(400, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(200, gin.H{"message": "approved"})
// }

// func (h *DocumentHandler) Reject(c *gin.Context) {
// 	id, _ := strconv.Atoi(c.Param("id"))
// 	var body struct{ Remark string }

// 	if err := c.ShouldBindJSON(&body); err != nil {
// 		c.JSON(400, gin.H{"error": "invalid request"})
// 		return
// 	}

// 	err := h.service.Reject(uint(id), body.Remark)
// 	if err != nil {
// 		c.JSON(400, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(200, gin.H{"message": "rejected"})
// }

func (h *DocumentHandler) BulkApprove(c *gin.Context) {
	var req dto.BulkActionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.service.BulkApprove(req.IDs, req.Reason)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"updated": updated,
	})
}


func (h *DocumentHandler) BulkReject(c *gin.Context) {
	var req dto.BulkActionRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.service.BulkReject(req.IDs, req.Reason)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"updated": updated,
	})
}

