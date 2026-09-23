import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ReviewModal } from '../features/review/ReviewModal';
import { ReviewIssue } from '../types/review';
import { documentService } from '../services/documentService';

const mockIssues: ReviewIssue[] = [
  {
    id: 'issue_1',
    type: 'RECONCILIATION_ERROR',
    severity: 'CRITICAL',
    status: 'OPEN',
    page: 1,
    field: 'grandTotal',
    originalValue: 150.0,
    aiInterpretation: { field: 'grandTotal', value: 150.0 },
    message: 'Calculated grand total differs from extracted',
    reason: 'Sum of line items is 140.00 while extracted total is 150.00',
    evidence: [{ text: 'Total: $150.00' }],
    resolutionOptions: ['KEEP_AS_IS', 'ADJUSTMENT', 'DISCOUNT'],
    resolved: false,
  },
  {
    id: 'issue_2',
    type: 'AMBIGUOUS_VALUE',
    severity: 'WARNING',
    status: 'OPEN',
    page: 1,
    field: 'taxAmount',
    originalValue: 10.0,
    aiInterpretation: { field: 'taxAmount', value: 10.0 },
    message: 'Tax rate ambiguous between state and local',
    reason: 'Tax rate listed as 8% or 10%',
    evidence: [{ text: 'Tax: $10.00' }],
    resolutionOptions: ['KEEP_AS_IS', 'ADJUSTMENT'],
    resolved: false,
  },
];

describe('ReviewModal Positioning, Portal, and Scroll Lock', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
  });

  it('1. Renders via React Portal attached directly to document.body', () => {
    const handleClose = vi.fn();
    const handleResolved = vi.fn();

    // Render inside a deeply nested container with scrolling simulation
    const { container } = render(
      <div id="nested-root" style={{ height: '5000px', overflowY: 'auto' }}>
        <ReviewModal
          isOpen={true}
          onClose={handleClose}
          reviewToken="rtok_test_123"
          issues={mockIssues}
          onReviewResolved={handleResolved}
        />
      </div>
    );

    // The modal overlay should NOT be inside #nested-root
    const nestedDiv = container.querySelector('#nested-root');
    expect(nestedDiv?.querySelector('[role="dialog"]')).toBeNull();

    // The modal dialog MUST be attached directly to document.body via Portal
    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('2. Top-anchored viewport positioning (not centered vertically)', () => {
    const handleClose = vi.fn();
    const handleResolved = vi.fn();

    render(
      <ReviewModal
        isOpen={true}
        onClose={handleClose}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={handleResolved}
      />
    );

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).toBeDefined();

    // Must have fixed inset-0 viewport positioning
    expect(dialog?.className).toContain('fixed');
    expect(dialog?.className).toContain('inset-0');

    // Must be top-anchored (items-start with responsive top padding)
    expect(dialog?.className).toContain('items-start');
    expect(dialog?.className).toContain('pt-4');
  });

  it('3. Internal modal scrolling and max-height bounds', () => {
    render(
      <ReviewModal
        isOpen={true}
        onClose={vi.fn()}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={vi.fn()}
      />
    );

    const dialog = document.body.querySelector('[role="dialog"]');
    const modalBox = dialog?.firstElementChild;

    // Modal box must have viewport-constrained max-height and flex-col
    expect(modalBox?.className).toContain('flex-col');
    expect(modalBox?.className).toContain('max-h-');

    // Content container must have internal scroll
    const scrollContainer = modalBox?.querySelector('.overflow-y-auto');
    expect(scrollContainer).not.toBeNull();
  });

  it('4. Background scroll lock is applied when modal opens and restored on close', () => {
    // Simulate main container in AppLayout
    const mainEl = document.createElement('main');
    mainEl.style.overflow = 'auto';
    document.body.appendChild(mainEl);

    const handleClose = vi.fn();

    const { rerender } = render(
      <ReviewModal
        isOpen={true}
        onClose={handleClose}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={vi.fn()}
      />
    );

    // Both document.body and main container must be locked
    expect(document.body.style.overflow).toBe('hidden');
    expect(mainEl.style.overflow).toBe('hidden');

    // Close the modal
    rerender(
      <ReviewModal
        isOpen={false}
        onClose={handleClose}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={vi.fn()}
      />
    );

    // Scroll state must be restored
    expect(document.body.style.overflow).toBe('');
    expect(mainEl.style.overflow).toBe('auto');

    document.body.removeChild(mainEl);
  });

  it('5. Escape key and backdrop click close the modal', () => {
    const handleClose = vi.fn();

    render(
      <ReviewModal
        isOpen={true}
        onClose={handleClose}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={vi.fn()}
      />
    );

    // Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Backdrop click
    const dialog = document.body.querySelector('[role="dialog"]');
    fireEvent.click(dialog!);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('6. Header and action buttons remain visible and submit review decisions', async () => {
    const handleClose = vi.fn();
    const handleResolved = vi.fn();

    const submitSpy = vi.spyOn(documentService, 'submitReview').mockResolvedValue({
      success: true,
      documentId: 'doc_123',
    } as any);

    render(
      <ReviewModal
        isOpen={true}
        onClose={handleClose}
        reviewToken="rtok_test_123"
        issues={mockIssues}
        onReviewResolved={handleResolved}
      />
    );

    // Header visible
    expect(screen.getByText('Document Review & Discrepancy Resolution')).toBeDefined();

    // Action buttons visible
    const applyButton = screen.getByText('Apply & Recalculate');
    expect(applyButton).toBeDefined();

    await act(async () => {
      fireEvent.click(applyButton);
    });

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewToken: 'rtok_test_123',
        resolutions: expect.arrayContaining([
          expect.objectContaining({ issueId: 'issue_1', userDecision: 'KEEP_AS_IS' }),
          expect.objectContaining({ issueId: 'issue_2', userDecision: 'KEEP_AS_IS' }),
        ]),
      })
    );
    expect(handleResolved).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
