import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    login,
    register,
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword,
  } = useAuth();

  if (!isAuthModalOpen) return null;

  const [activeTab, setActiveTab] = useState<'password' | 'otp' | 'register' | 'forgot'>(
    authModalMode === 'register' ? 'register' : 'password'
  );

  // Password Login state
  const [identifier, setIdentifier] = useState('anwithrenukunta9@gmail.com');
  const [password, setPassword] = useState('Citizen@1234');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login state
  const [mobileNumber, setMobileNumber] = useState('+91 98450 11223');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('citizen');
  const [regWard, setRegWard] = useState('Ward 112 - Indiranagar');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Demo account filler (Only Citizen, Worker, Volunteer)
  const fillDemoAccount = (role: 'citizen' | 'worker' | 'volunteer') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setActiveTab('password');
    if (role === 'citizen') {
      setIdentifier('anwithrenukunta9@gmail.com');
      setPassword('Citizen@1234');
    } else if (role === 'worker') {
      setIdentifier('worker@civicconnect.gov.in');
      setPassword('Worker@1234');
    } else if (role === 'volunteer') {
      setIdentifier('volunteer@example.com');
      setPassword('Volunteer@1234');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(identifier, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await sendOtp(mobileNumber);
    setLoading(false);
    if (res.success) {
      setOtpSent(true);
      setSuccessMsg(res.message);
      setOtpCode(res.demoOtp || '482910');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await verifyOtp(mobileNumber, otpCode);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      ward: regWard,
    });
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    if (forgotStep === 'request') {
      const res = await forgotPassword(forgotEmail);
      setLoading(false);
      if (res.success) {
        setForgotStep('reset');
        setResetCode(res.resetCode || 'RESET-9921');
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await resetPassword(forgotEmail, resetCode, newPassword);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setActiveTab('password');
          setIdentifier(forgotEmail);
          setPassword(newPassword);
          setForgotStep('request');
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                CivicConnect Secure Portal
              </h3>
              <p className="text-[11px] text-slate-500">
                Authorized credentials & verified session authentication
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-white px-6 pt-3 dark:border-slate-800 dark:bg-slate-900 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('password');
              setErrorMsg(null);
            }}
            className={`border-b-2 pb-2.5 px-3 transition-colors ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Password Sign In
          </button>

          <button
            onClick={() => {
              setActiveTab('otp');
              setErrorMsg(null);
            }}
            className={`border-b-2 pb-2.5 px-3 transition-colors ${
              activeTab === 'otp'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Mobile OTP
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            className={`border-b-2 pb-2.5 px-3 transition-colors ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Register Account
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Quick Demo Credential Selectors (Only Citizen, Worker, Volunteer) */}
          <div className="rounded-2xl bg-blue-50/60 p-3.5 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Quick 1-Click Role Login:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('citizen')}
                className="rounded-lg bg-white px-2.5 py-2 font-bold text-slate-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700 truncate text-center"
              >
                👤 Citizen (Anwith)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('volunteer')}
                className="rounded-lg bg-white px-2.5 py-2 font-bold text-slate-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700 truncate text-center"
              >
                🤝 Volunteer
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('worker')}
                className="rounded-lg bg-white px-2.5 py-2 font-bold text-slate-700 hover:bg-blue-100 hover:text-blue-800 dark:bg-slate-800 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700 truncate text-center"
              >
                👷 Worker
              </button>
            </div>
          </div>

          {/* TAB 1: PASSWORD LOGIN */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address or Mobile Phone
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@civicconnect.gov.in"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {activeTab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mobile Number
                    </label>
                    <div className="relative mt-1">
                      <Smartphone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98450 11223"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <span>Send Verification OTP</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Enter 6-digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Change number
                      </button>
                    </div>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="482910"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-mono tracking-widest text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white text-center font-bold"
                        required
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Standard sandbox verification OTP: <strong>482910</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verify OTP & Access Session</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTER ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="E.g. Priya Sharma"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Initial Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as Role)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option value="citizen">Citizen</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="worker">Field Staff / Worker</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Residential Ward
                </label>
                <select
                  value={regWard}
                  onChange={(e) => setRegWard(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                  <option value="Ward 112 - Indiranagar">Ward 112 - Indiranagar</option>
                  <option value="Ward 151 - Koramangala">Ward 151 - Koramangala</option>
                  <option value="Ward 45 - Malleshwaram">Ward 45 - Malleshwaram</option>
                  <option value="Ward 153 - Jayanagar">Ward 153 - Jayanagar</option>
                  <option value="Ward 24 - Kadri, Mangaluru">Ward 24 - Kadri, Mangaluru</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password *
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create secure password (min 6 chars)"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <span>Create Account (+50 Civic Points)</span>
              </button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {forgotStep === 'request' ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Your Registered Email
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@civicconnect.gov.in"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs text-slate-800 focus:outline-hidden dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Reset Code
                    </label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono font-bold text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('password')}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Back to Sign In
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  {forgotStep === 'request' ? 'Send Reset Code' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
