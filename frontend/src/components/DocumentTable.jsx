import { useState, useMemo } from "react";

export default function DocumentTable({
  documents,
  selectedIds,
  setSelectedIds,
  onApprove,
  onReject,
}) {
  // --- States สำหรับ Datatable Features ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // เพิ่ม state สำหรับ itemsPerPage

  // --- Logic 1: Filter (ค้นหา) ---
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.action_reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  // --- Logic 2: Sorting (เรียงลำดับ) ---
  const sortedDocs = useMemo(() => {
    let sortableItems = [...filteredDocs];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredDocs, sortConfig]);

  // --- Logic 3: Pagination (แบ่งหน้า) ---
  const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);
  const currentDocs = sortedDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function เปลี่ยนการเรียงลำดับ
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Function เลือก / ยกเลิก checkbox
  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Function เลือกทั้งหมดในหน้านั้น
  const toggleSelectAll = () => {
    const currentIds = currentDocs
      .filter((doc) => doc.status === "pending")
      .map((doc) => doc.id);
    
    const allSelected = currentIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !currentIds.includes(id)));
    } else {
      // เพิ่มเฉพาะที่ยังไม่ได้เลือก
      const newIds = currentIds.filter(id => !selectedIds.includes(id));
      setSelectedIds([...selectedIds, ...newIds]);
    }
  };

  const isSelectable = (doc) => doc.status === "pending";
  const hasPendingSelected = documents.some(
    (doc) => selectedIds.includes(doc.id) && doc.status === "pending"
  );

  // Function เปลี่ยน items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset หน้าไปหน้าแรกเมื่อเปลี่ยนจำนวนรายการ
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      {/* ===== Toolbar (Search & Actions) ===== */}
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            disabled={!hasPendingSelected}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              hasPendingSelected
                ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            อนุมัติ
          </button>

          <button
            onClick={onReject}
            disabled={!hasPendingSelected}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              hasPendingSelected
                ? "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            ไม่อนุมัติ
          </button>
        </div>

        <div className="flex gap-4 items-center w-full md:w-auto">
           {/* Dropdown เลือก Items Per Page */}
           <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
          >
            <option value={5}>5 รายการ</option>
            <option value={10}>10 รายการ</option>
            <option value={25}>25 รายการ</option>
            <option value={50}>50 รายการ</option>
            <option value={100}>100 รายการ</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset หน้าเมื่อค้นหา
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="p-3 border-b text-center w-12">
                <input 
                  type="checkbox" 
                  onChange={toggleSelectAll}
                  checked={
                    currentDocs.length > 0 && 
                    currentDocs.filter(d => d.status === 'pending').every(d => selectedIds.includes(d.id))
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th 
                className="p-3 border-b text-left cursor-pointer hover:bg-gray-200 transition-colors group"
                onClick={() => requestSort('title')}
              >
                รายการ 
                <span className="ml-1 inline-block text-gray-400 group-hover:text-gray-600">
                  {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </span>
              </th>
              <th 
                className="p-3 border-b text-left cursor-pointer hover:bg-gray-200 transition-colors group"
                onClick={() => requestSort('action_reason')}
              >
                เหตุผล
                <span className="ml-1 inline-block text-gray-400 group-hover:text-gray-600">
                  {sortConfig.key === 'action_reason' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </span>
              </th>
              <th 
                className="p-3 border-b text-center cursor-pointer hover:bg-gray-200 transition-colors group"
                onClick={() => requestSort('status')}
              >
                สถานะ
                <span className="ml-1 inline-block text-gray-400 group-hover:text-gray-600">
                  {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="text-gray-600 text-sm font-light">
            {currentDocs.map((doc) => {
              const disabled = !isSelectable(doc);

              return (
                <tr key={doc.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  {/* Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      disabled={disabled}
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </td>

                  {/* รายการ */}
                  <td className="p-3 font-medium text-gray-800">{doc.title}</td>

                  {/* เหตุผล */}
                  <td className="p-3">{doc.action_reason || "-"}</td>

                  {/* สถานะ */}
                  <td className="p-3 text-center">
                    {doc.status === "pending" && (
                      <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs font-semibold">
                        รออนุมัติ
                      </span>
                    )}
                    {doc.status === "approved" && (
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">
                        อนุมัติแล้ว
                      </span>
                    )}
                    {doc.status === "rejected" && (
                      <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs font-semibold">
                        ไม่อนุมัติ
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {currentDocs.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500 bg-gray-50">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination Controls ===== */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t gap-4">
          <span className="text-sm text-gray-600">
            แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredDocs.length)} จาก {filteredDocs.length} รายการ
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-sm"
            >
              ก่อนหน้า
            </button>
            <div className="flex gap-1 overflow-x-auto max-w-50 sm:max-w-none">
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                 <button
                   key={page}
                   onClick={() => setCurrentPage(page)}
                   className={`w-8 h-8 shrink-0 flex items-center justify-center rounded text-sm ${
                     currentPage === page 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-white border hover:bg-gray-100'
                   }`}
                 >
                   {page}
                 </button>
               ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-sm"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </div>
  );
}