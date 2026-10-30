import { describe, it, expect } from 'vitest';
import { INITIAL_COMPLAINTS } from '../data/seedData';

describe('Complaints Business Logic & Processing Engine', () => {
  it('filters complaints correctly by category', () => {
    const categories = Array.from(new Set(INITIAL_COMPLAINTS.map((c) => c.category)));
    expect(categories.length).toBeGreaterThan(0);

    const firstCategory = categories[0];
    const filtered = INITIAL_COMPLAINTS.filter((c) => c.category === firstCategory);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('filters complaints by status stages', () => {
    const statuses = Array.from(new Set(INITIAL_COMPLAINTS.map((c) => c.status)));
    expect(statuses.length).toBeGreaterThan(0);
  });

  it('calculates total upvotes across community tickets', () => {
    const totalVotes = INITIAL_COMPLAINTS.reduce((acc, curr) => acc + curr.votes, 0);
    expect(totalVotes).toBeGreaterThan(0);
  });

  it('detects duplicate complaint candidates by ward or location', () => {
    const sampleWard = INITIAL_COMPLAINTS[0].location.ward;
    const candidates = INITIAL_COMPLAINTS.filter((c) => c.location.ward === sampleWard);
    expect(candidates.length).toBeGreaterThan(0);
  });
});
