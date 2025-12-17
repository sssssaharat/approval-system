export default function DocumentTable({
  documents,
  selectedIds,
  setSelectedIds,
  onApprove,
  onReject,
}) {
  // เลือก / ยกเลิก checkbox ทีละรายการ
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // เลือกได้เฉพาะรายการที่ status = pending
  const isSelectable = (doc) => doc.status === "pending";

  // ปุ่มอนุมัติ / ไม่อนุมัติ กดได้เมื่อมี pending ถูกเลือก
  const hasPendingSelected = documents.some(
    (doc) => selectedIds.includes(doc.id) && doc.status === "pending"
  );

  return (
    <div className="bg-white shadow rounded-lg">
      {/* ===== Action Buttons ===== */}
      <div className="flex gap-2 p-4 border-b">
        <button
          onClick={onApprove}
          disabled={!hasPendingSelected}
          className={`px-4 py-2 rounded text-white ${
            hasPendingSelected
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          อนุมัติ
        </button>

        <button
          onClick={onReject}
          disabled={!hasPendingSelected}
          className={`px-4 py-2 rounded text-white ${
            hasPendingSelected
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          ไม่อนุมัติ
        </button>
      </div>

      {/* ===== Table ===== */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-center w-12"></th>
            <th className="p-3 border text-left">รายการ</th>
            <th className="p-3 border text-left">เหตุผล</th>
            <th className="p-3 border text-center">สถานะเอกสาร</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((doc) => {
            const disabled = !isSelectable(doc);

            return (
              <tr key={doc.id} className="hover:bg-gray-50">
                {/* Checkbox */}
                <td className="p-3 border text-center">
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={selectedIds.includes(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                  />
                </td>

                {/* รายการ */}
                <td className="p-3 border">{doc.title}</td>

                {/* เหตุผล */}
                <td className="p-3 border text-gray-700">
                  {doc.action_reason || "-"}
                </td>

                {/* สถานะ */}
                <td className="p-3 border text-center">
                  {doc.status === "pending" && (
                    <span className="text-yellow-600 font-medium">
                      รออนุมัติ
                    </span>
                  )}
                  {doc.status === "approved" && (
                    <span className="text-green-600 font-medium">
                      อนุมัติ
                    </span>
                  )}
                  {doc.status === "rejected" && (
                    <span className="text-red-600 font-medium">
                      ไม่อนุมัติ
                    </span>
                  )}
                </td>
              </tr>
            );
          })}

          {documents.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                ไม่มีข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
