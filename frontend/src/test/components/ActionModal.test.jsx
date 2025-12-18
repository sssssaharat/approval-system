import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionModal from '../../components/ActionModal';
import { vi, test, expect, beforeEach, describe } from 'vitest'; 

// บอกว่าถ้ามีการเรียก bulkApprove หรือ bulkReject ให้ใช้ mock function แทน
vi.mock('../../api/documentApi', () => ({
  bulkApprove: vi.fn().mockResolvedValue({}), 
  bulkReject: vi.fn().mockResolvedValue({}),
}));

describe('IT-03-2 & 3: ActionModal Component', () => {
  const mockOnConfirm = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.stubGlobal('alert', vi.fn()); 
  });

  test('Validation: ไม่กรอกเหตุผล ต้องกดปุ่มยืนยันไม่ได้ หรือไม่เรียกฟังก์ชัน', async () => {
    const user = userEvent.setup();
    
    render(
      <ActionModal 
        open={true} 
        type="approve" 
        onSuccess={mockOnConfirm} 
        onClose={mockOnClose} 
        ids={[101]}
      />
    );

    // หาปุ่มอนุมัติ
    const confirmBtn = screen.getByRole('button', { name: /^อนุมัติ$/i });
    
    await user.click(confirmBtn);

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('กรุณากรอกเหตุผล'));
    
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test('Success: กรอกเหตุผลแล้วกดปุ่มยืนยันได้ถูกต้อง', async () => {
    const user = userEvent.setup();
    render(
      <ActionModal 
        open={true} 
        type="approve" 
        onSuccess={mockOnConfirm} 
        onClose={mockOnClose} 
        ids={[101]}
      />
    );

    const input = screen.getByPlaceholderText(/เหตุผล/i);
    await user.type(input, 'อนุมัติผ่านครับ');

    await user.click(screen.getByRole('button', { name: /^อนุมัติ$/i }));

    await waitFor(() => {
        expect(mockOnConfirm).toHaveBeenCalled();
    });
  });
});