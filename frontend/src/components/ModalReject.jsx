import React, { useState } from "react";

export default function ModalReject({ open, close, submit, document }) {
  const [remark, setRemark] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-[420px] shadow">
        <h3 className="text-xl font-semibold text-red-600">ยืนยันการไม่อนุมัติ</h3>

        <textarea
          className="w-full border mt-3 p-2"
          placeholder="หมายเหตุ..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={close} className="px-3 py-1 border rounded">
            ยกเลิก
          </button>

          <button
            onClick={() => submit(document.id, remark)}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            ไม่อนุมัติ
          </button>
        </div>
      </div>
    </div>
  );
}
