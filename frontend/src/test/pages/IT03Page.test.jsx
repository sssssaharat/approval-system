import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IT03Page from '../../../src/pages/IT03Page';
import { test, expect, describe, vi, beforeEach } from 'vitest';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('IT-03 Unit Test', () => {

  beforeEach(() => {
    vi.stubGlobal('alert', vi.fn());
  });

  // --- Test 2: Approve Flow ---
  test('Approve Flow: ส่งข้อมูลถูกต้อง', async () => {
    const user = userEvent.setup();
    const approveSpy = vi.fn();

    // 🛠️ Override Handler: ดักจับ POST
    server.use(
      http.put('*', async ({ request }) => {
        // เช็คว่า URL มีคำว่า approve หรือไม่
        if (request.url.includes('approve')) {
          const body = await request.json();
          approveSpy(body);
          return HttpResponse.json({ message: 'OK' });
        }
        return HttpResponse.json({});
      })
    );

    render(<IT03Page />);

    // 1. เลือกรายการ
    const targetItem = await screen.findByText('เอกสารขอเบิกงบ (A)');
    const row = targetItem.closest('tr');
    await user.click(within(row).getByRole('checkbox'));

    // 2. กดปุ่มอนุมัติ (หน้าหลัก)
    await user.click(screen.getByRole('button', { name: /^อนุมัติ$/i }));

    // 3. กรอกเหตุผล
    const modalTitle = await screen.findByText(/ยืนยัน/i);
    const modalContainer = modalTitle.closest('div').parentElement;
    
    const input = within(modalContainer).getByPlaceholderText(/เหตุผล/i);
    await user.type(input, 'ผ่านครับ');

    // 4. กดยืนยัน (ใน Modal)
    const modalBtn = within(modalContainer).getByRole('button', { name: /^อนุมัติ$/i });
    await user.click(modalBtn);

    // 5. ตรวจสอบ (ต้องผ่าน!)
    await waitFor(() => {
      expect(approveSpy).toHaveBeenCalled();
      expect(approveSpy).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'ผ่านครับ' })
      );
    });
  });

  // --- Test 3: Reject Flow ---
  test('Reject Flow: ส่งข้อมูลถูกต้อง', async () => {
    const user = userEvent.setup();
    const rejectSpy = vi.fn();

    server.use(
      http.put('*', async ({ request }) => {
        if (request.url.includes('reject')) {
          const body = await request.json();
          rejectSpy(body);
          return HttpResponse.json({ message: 'OK' });
        }
        return HttpResponse.json({});
      })
    );

    render(<IT03Page />);

    // เลือกรายการ -> กดไม่อนุมัติ
    const targetItem = await screen.findByText('เอกสารขอเบิกงบ (A)');
    await user.click(within(targetItem.closest('tr')).getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /^ไม่อนุมัติ$/i }));

    // กรอกเหตุผล
    const modalTitle = await screen.findByText(/ยืนยัน/i);
    const modalContainer = modalTitle.closest('div').parentElement;
    await user.type(within(modalContainer).getByPlaceholderText(/เหตุผล/i), 'ตกหล่น');

    // ยืนยัน
    const modalBtn = within(modalContainer).getByRole('button', { name: /^ไม่อนุมัติ$/i });
    await user.click(modalBtn);

    // ตรวจสอบ
    await waitFor(() => {
      expect(rejectSpy).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'ตกหล่น' })
      );
    });
  });

});