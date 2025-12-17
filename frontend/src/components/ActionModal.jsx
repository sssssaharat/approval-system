import { useState } from "react";
import { bulkApprove, bulkReject } from "../api/documentApi";

export default function ActionModal({
  open,
  type, // "approve" | "reject"
  ids,
  onClose,
  onSuccess,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const isApprove = type === "approve";
  const title = isApprove ? "การยืนยันอนุมัติ" : "การยืนยันไม่อนุมัติ";
  const confirmText = isApprove ? "อนุมัติ" : "ไม่อนุมัติ";

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert("กรุณากรอกเหตุผล");
      return;
    }

    try {
      setLoading(true);

      if (isApprove) {
        await bulkApprove(ids, reason);
      } else {
        await bulkReject(ids, reason);
      }

      setReason("");
      onSuccess();
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>

        {/* Body */}
        <div className="p-4">
          <label className="block mb-2 text-sm font-medium">
            เหตุผล
          </label>
          <textarea
            rows={4}
            className="w-full border rounded p-2"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="กรอกเหตุผล..."
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded border"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              isApprove
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
