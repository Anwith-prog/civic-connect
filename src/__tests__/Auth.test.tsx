import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestAuthConsumer = () => {
  const { currentUser, isAuthenticated, logout, quickSwitchRole } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'GUEST'}</div>
      <div data-testid="user-name">{currentUser?.name || 'No User'}</div>
      <div data-testid="user-role">{currentUser?.role || 'none'}</div>
      <button onClick={logout}>Do Logout</button>
      <button onClick={() => quickSwitchRole('worker')}>Switch Worker</button>
      <button onClick={() => quickSwitchRole('volunteer')}>Switch Volunteer</button>
    </div>
  );
};

describe('AuthContext & Session Management', () => {
  beforeEach(() => {
    global.fetch = vi.fn((url: string | URL | Request) => {
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
            },
          }),
      } as Response);
    });
  });

  it('provides authenticated state for Anwith by default', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_IN');
      expect(screen.getByTestId('user-name').textContent).toBe('Anwith');
    });
  });

  it('handles role switching dynamically between citizen, worker, and volunteer', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-name').textContent).toBe('Anwith'));

    const workerBtn = screen.getByText('Switch Worker');
    fireEvent.click(workerBtn);
    expect(screen.getByTestId('user-role').textContent).toBe('worker');

    const volBtn = screen.getByText('Switch Volunteer');
    fireEvent.click(volBtn);
    expect(screen.getByTestId('user-role').textContent).toBe('volunteer');
  });

  it('handles logout session clearing', async () => {
    render(
      <AuthProvider>
        <TestAuthConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('user-name').textContent).toBe('Anwith'));

    const logoutBtn = screen.getByText('Do Logout');
    fireEvent.click(logoutBtn);
    expect(screen.getByTestId('auth-status').textContent).toBe('GUEST');
  });
});
