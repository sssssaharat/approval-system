package main

import (
	"approval-system/internal/config"
	"approval-system/internal/handler"
	"approval-system/internal/model"
	"approval-system/internal/repository"
	"approval-system/internal/router"
	"approval-system/internal/service"
)

func main() {
	db := config.ConnectDatabase()
	db.AutoMigrate(&model.Document{})

	// setup layers
	repo := repository.NewDocumentRepository(db)
	svc := service.NewDocumentService(repo)
	handler := handler.NewDocumentHandler(svc)
	r := router.SetupRouter(handler)

	r.Run(":8080")
}
