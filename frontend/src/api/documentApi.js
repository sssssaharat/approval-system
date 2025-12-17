import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const fetchDocuments = () => {
  return api.get("/documents");
};

export const bulkApprove = (ids, reason) => {
  return api.put("/documents/approve", {
    ids,
    reason,
  });
};

export const bulkReject = (ids, reason) => {
  return api.put("/documents/reject", {
    ids,
    reason,
  });
};
