package router

import (
	"approval-system/internal/handler"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(documentHandler *handler.DocumentHandler) *gin.Engine {
	r := gin.Default()

	// ===== CORS CONFIG =====
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		api.GET("/documents", documentHandler.GetAll)
		api.PUT("/documents/approve", documentHandler.BulkApprove)
		api.PUT("/documents/reject", documentHandler.BulkReject)
	}

	return r
}
