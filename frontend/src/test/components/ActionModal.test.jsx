import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionModal from '../../components/ActionModal';
import { vi, test, expect, beforeEach, describe } from 'vitest'; 

describe('IT-03-2 & 3: ActionModal Component', () => {
  const mockOnConfirm = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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

    const confirmBtn = screen.getByRole('button', { name: /^อนุมัติ$/i }); 
    
    await user.click(confirmBtn);

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

    // 1. พิมพ์เหตุผล
    const input = screen.getByPlaceholderText(/เหตุผล/i);
    await user.type(input, 'อนุมัติผ่านครับ');

    await user.click(screen.getByRole('button', { name: /^อนุมัติ$/i }));

  });
});