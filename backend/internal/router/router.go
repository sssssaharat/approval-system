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
		api.PUT("/documents/:id/approve", documentHandler.Approve)
		api.PUT("/documents/:id/reject", documentHandler.Reject)
	}

	return r
}
