package main

import (
	"approval-system/internal/config"
	"approval-system/internal/handler"
	"approval-system/internal/model"
	"approval-system/internal/repository"
	"approval-system/internal/router"
	"approval-system/internal/service"
	"fmt"
	"log"
)

func main() {
	db := config.ConnectDatabase()
	db.AutoMigrate(&model.Document{})
	// ===== MOCK DATA (Seed) =====
	var count int64
	db.Model(&model.Document{}).Count(&count)

	if count == 0 {
		for i := 1; i <= 20; i++ {
			db.Create(&model.Document{
				Title:  fmt.Sprintf("รายการที่ %d", i),
				Status: "pending",
				ActionReason: "",
			})
		}
		log.Println("Seeded 20 mock documents")
	}

	// setup layers
	repo := repository.NewDocumentRepository(db)
	svc := service.NewDocumentService(repo)
	handler := handler.NewDocumentHandler(svc)
	r := router.SetupRouter(handler)

	r.Run(":8080")
}
