package dto

type BulkActionRequest struct {
	IDs    []uint `json:"ids" binding:"required"`
	Reason string `json:"reason" binding:"required"`
}
