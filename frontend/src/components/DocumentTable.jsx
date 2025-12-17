import React, { useEffect, useRef } from "react";
import { DataTable } from "simple-datatables";

export default function DocumentTable({ documents, openApprove, openReject }) {
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      new DataTable(tableRef.current);
    }
  }, [documents]);

  return (
    <div className="w-full mt-4">
      <table ref={tableRef} className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">รายการ</th>
            <th className="p-2 border">ผู้ขอ</th>
            <th className="p-2 border">สถานะ</th>
            <th className="p-2 border">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="p-2 border">{doc.id}</td>
              <td className="p-2 border">{doc.title}</td>
              <td className="p-2 border">{doc.requester}</td>

              <td className="p-2 border">
                <span className={
                  doc.status === "pending" ? "bg-yellow-200 px-2 py-1 rounded" :
                  doc.status === "approved" ? "bg-green-200 px-2 py-1 rounded" :
                  "bg-red-200 px-2 py-1 rounded"
                }>
                  {doc.status === "pending" ? "รออนุมัติ" :
                   doc.status === "approved" ? "อนุมัติ" :
                   "ไม่อนุมัติ"}
                </span>
              </td>

              <td className="p-2 border">
                {doc.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openApprove(doc)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      อนุมัติ
                    </button>

                    <button
                      onClick={() => openReject(doc)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ไม่อนุมัติ
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
