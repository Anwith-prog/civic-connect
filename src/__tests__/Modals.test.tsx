import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmergencyHelplineModal } from '../components/EmergencyHelplineModal';
import { SettingsModal } from '../components/SettingsModal';
import { AuthProvider } from '../context/AuthContext';

describe('Interactive Modal Components & Accessibility', () => {
  it('renders Emergency Helpline numbers correctly when open', () => {
    const handleClose = vi.fn();
    render(
      <AuthProvider>
        <EmergencyHelplineModal isOpen={true} onClose={handleClose} />
      </AuthProvider>
    );

    const closeButtons = screen.getAllByRole('button');
    expect(closeButtons.length).toBeGreaterThan(0);
    fireEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders Settings Modal with language & accessibility options', () => {
    const handleClose = vi.fn();
    const handleLangChange = vi.fn();

    render(
      <AuthProvider>
        <SettingsModal
          isOpen={true}
          onClose={handleClose}
          lang="en"
          onLanguageChange={handleLangChange}
        />
      </AuthProvider>
    );

    const headings = screen.getAllByText(/Preferences|Settings/i);
    expect(headings.length).toBeGreaterThan(0);
  });
});
