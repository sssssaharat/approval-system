const API_BASE = "http://localhost:8080/api";

export async function getDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
}

export async function approveDocument(id, remark) {
  return fetch(`${API_BASE}/documents/${id}/approve`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ remark })
  });
}

export async function rejectDocument(id, remark) {
  return fetch(`${API_BASE}/documents/${id}/reject`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ remark })
  });
}
