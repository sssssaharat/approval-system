import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DocumentTable from "../../../src/components/DocumentTable";
import { vi, test, expect, describe } from "vitest";

describe("DocumentTable Component (UI Only)", () => {
  const mockData = [
    { id: 1, title: "Test Doc 1", status: "pending" },
    { id: 2, title: "Test Doc 2", status: "approved" },
  ];

  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();
  const mockSetSelectedIds = vi.fn();

  test("Render ข้อมูลได้ถูกต้องครบทุกแถว", () => {
    render(
      <DocumentTable
        documents={mockData}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        selectedIds={[]}
        setSelectedIds={mockSetSelectedIds}
      />
    );

    expect(screen.getByText("Test Doc 1")).toBeInTheDocument();
    expect(screen.getByText("Test Doc 2")).toBeInTheDocument();
  });

  test("Checkbox Logic: สถานะ Pending เลือกได้, Approved เลือกไม่ได้", async () => {
    const user = userEvent.setup();
    render(
      <DocumentTable
        documents={mockData}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        selectedIds={[]}
        setSelectedIds={mockSetSelectedIds}
      />
    );

    const pendingRow = screen.getByText("Test Doc 1").closest("tr");
    const checkbox1 = within(pendingRow).getByRole("checkbox");
    
    expect(checkbox1).toBeEnabled();
    await user.click(checkbox1);
    expect(mockSetSelectedIds).toHaveBeenCalled();

    const approvedRow = screen.getByText("Test Doc 2").closest("tr");
    const checkbox2 = within(approvedRow).getByRole("checkbox");
    
    expect(checkbox2).toBeDisabled();
  });

  test("Bulk Actions: ปุ่มอนุมัติทำงานถูกต้อง (เมื่อมีการเลือกรายการ)", async () => {
    const user = userEvent.setup();
    
    render(
      <DocumentTable
        documents={mockData}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        selectedIds={[1]}
        setSelectedIds={mockSetSelectedIds}
      />
    );

    const approveBtn = screen.getByRole("button", { name: /^อนุมัติ$/i });
    const rejectBtn = screen.getByRole("button", { name: /^ไม่อนุมัติ$/i }); 
    expect(approveBtn).toBeEnabled();
    expect(rejectBtn).toBeEnabled();

    await user.click(approveBtn);

    expect(mockOnApprove).toHaveBeenCalled();
  });

  test("Empty State: กรณีไม่มีข้อมูล ต้องแสดงข้อความแจ้งเตือน", () => {
    render(
      <DocumentTable
        documents={[]}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
        selectedIds={[]}
        setSelectedIds={mockSetSelectedIds}
      />
    );

    expect(screen.getByText(/ไม่พบข้อมูล/i)).toBeInTheDocument();
  });
});