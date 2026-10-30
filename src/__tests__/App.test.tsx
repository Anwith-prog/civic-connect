import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from '../App';

// Mock Leaflet & Canvas Confetti
vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(),
      addLayer: vi.fn(),
      remove: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn(),
      bindPopup: vi.fn(),
    })),
    icon: vi.fn(() => ({})),
  },
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('CivicConnect Application Frontend', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url: string | URL | Request) => {
      const urlStr = String(url);
      if (urlStr.includes('/api/auth/me')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: {
                id: 'USR-ANWITH',
                name: 'Anwith',
                email: 'anwithrenukunta9@gmail.com',
                role: 'citizen',
                points: 650,
                badges: ['Community Champion'],
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
              },
            }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      } as Response);
    });
  });

  it('renders application brand title and overview text', () => {
    render(<App />);
    const appTitles = screen.getAllByText(/Overview|CivicConnect/i);
    expect(appTitles.length).toBeGreaterThan(0);
  });

  it('renders search input element', () => {
    render(<App />);
    const searchInputs = screen.getAllByPlaceholderText(/Search/i);
    expect(searchInputs.length).toBeGreaterThan(0);

    fireEvent.change(searchInputs[0], { target: { value: 'pothole' } });
    expect((searchInputs[0] as HTMLInputElement).value).toBe('pothole');
  });

  it('renders quick Report Problem action button', () => {
    render(<App />);
    const reportButtons = screen.getAllByRole('button', { name: /Report/i });
    expect(reportButtons.length).toBeGreaterThan(0);
  });
});
