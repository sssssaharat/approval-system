import React, { useEffect, useState, useCallback } from "react";
import {
  getDocuments,
  approveDocument,
  rejectDocument,
} from "../api/documentApi";

import DocumentTable from "../components/DocumentTable";
import ModalApprove from "../components/ModalApprove";
import ModalReject from "../components/ModalReject";

export default function DocumentPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocs(data);
    } catch (error) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">หน้า IT 03-1 (อนุมัติเอกสาร)</h1>

      {loading ? (
        <p className="mt-4">กำลังโหลด...</p>
      ) : (
        <DocumentTable
          documents={docs}
          openApprove={(doc) => {
            setSelected(doc);
            setApproveOpen(true);
          }}
          openReject={(doc) => {
            setSelected(doc);
            setRejectOpen(true);
          }}
        />
      )}

      <ModalApprove
        open={approveOpen}
        close={() => setApproveOpen(false)}
        document={selected}
        submit={async (id, remark) => {
          await approveDocument(id, remark);
          setApproveOpen(false);
          load();
        }}
      />

      <ModalReject
        open={rejectOpen}
        close={() => setRejectOpen(false)}
        document={selected}
        submit={async (id, remark) => {
          await rejectDocument(id, remark);
          setRejectOpen(false);
          load();
        }}
      />
    </div>
  );
}
