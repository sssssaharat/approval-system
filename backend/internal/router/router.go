package router

import (
	"approval-system/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter(documentHandler *handler.DocumentHandler) *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/documents", documentHandler.GetAll)

		// bulk action
		api.PUT("/documents/approve", documentHandler.BulkApprove)
		api.PUT("/documents/reject", documentHandler.BulkReject)
	}

	return r
}
