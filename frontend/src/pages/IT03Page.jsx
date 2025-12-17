import { useEffect, useState } from "react";
import { fetchDocuments } from "../api/documentApi";
import DocumentTable from "../components/DocumentTable";
import ActionModal from "../components/ActionModal";

export default function IT03Page() {
  const [documents, setDocuments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalType, setModalType] = useState(null); // approve | reject
  const [open, setOpen] = useState(false);

  const loadDocuments = async () => {
    const res = await fetchDocuments();
    setDocuments(res.data);
  };

  useEffect(() => {
    const run = async () => {
      await loadDocuments();
    };
    run();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">IT-03-1 รายการเอกสาร</h1>

      <DocumentTable
        documents={documents}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        onApprove={() => {
          setModalType("approve");
          setOpen(true);
        }}
        onReject={() => {
          setModalType("reject");
          setOpen(true);
        }}
      />

      <ActionModal
        open={open}
        type={modalType}
        ids={selectedIds}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          setSelectedIds([]);
          loadDocuments(); // reuse ได้
        }}
      />
    </div>
  );
}
