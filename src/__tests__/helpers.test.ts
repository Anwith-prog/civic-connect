import { describe, it, expect } from 'vitest';
import {
  getStatusBadgeColor,
  getPriorityBadgeColor,
  sanitizeInput,
  calculateAverageResolutionHours,
} from '../utils/helpers';

describe('Helper Utility Functions', () => {
  it('should return correct badge color for status stages', () => {
    expect(getStatusBadgeColor('Submitted')).toContain('amber');
    expect(getStatusBadgeColor('In Progress')).toContain('amber');
    expect(getStatusBadgeColor('Resolved')).toContain('emerald');
    expect(getStatusBadgeColor('Cannot be solved')).toContain('red');
  });

  it('should return correct color for priorities', () => {
    expect(getPriorityBadgeColor('Emergency')).toContain('red');
    expect(getPriorityBadgeColor('High')).toContain('rose');
    expect(getPriorityBadgeColor('Medium')).toContain('amber');
    expect(getPriorityBadgeColor('Low')).toContain('emerald');
  });

  it('should sanitize HTML inputs to prevent XSS attacks', () => {
    const dangerousInput = '<script>alert("xss")</script><b>Indiranagar Road</b>';
    const clean = sanitizeInput(dangerousInput);
    expect(clean).not.toContain('<script>');
    expect(clean).toContain('&lt;script&gt;');
  });

  it('should calculate accurate SLA turnaround hours', () => {
    const hours = calculateAverageResolutionHours([
      { createdAt: '2026-10-01T08:00:00Z', resolvedAt: '2026-10-02T08:00:00Z' },
      { createdAt: '2026-10-01T10:00:00Z', resolvedAt: '2026-10-02T22:00:00Z' },
    ]);
    expect(hours).toBe(30);
  });
});
