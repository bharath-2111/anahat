import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { validateLoginData } from '../utils/validators';
import {
  Shield,
  User,
  Phone,
  Mail,
  ArrowRight,
  Lock,
  Check,
  Activity,
  ArrowLeft,
  RefreshCw,
  KeyRound,
} from 'lucide-react';

export default function Login() {
  const { userData, loginUser } = useAnalysis();
  const navigate = useNavigate();

  const [step, setStep] = useState('details');
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Transcript animation state
  const [transcriptLines, setTranscriptLines] = useState([
    { id: 1, text: '🔊  voice sample · 24kHz', active: true },
    { id: 2, text: '📡  spectral analysis · LPC', active: false },
    { id: 3, text: '🛡️  authenticity score · 92%', active: false },
    { id: 4, text: '⚡  risk assessment · low', active: false },
  ]);
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  // Cycle through transcript lines
  useEffect(() => {
    const interval = setInterval(() => {
      setTranscriptIndex((prev) => {
        const next = (prev + 1) % transcriptLines.length;
        setTranscriptLines((lines) =>
          lines.map((line, idx) => ({
            ...line,
            active: idx === next,
          }))
        );
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [transcriptLines.length]);

  // OTP cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const validation = validateLoginData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp('');
    setOtpError('');
    setStep('otp');
    setResendCooldown(30);
    console.log('VoxShield Demo OTP:', newOtp);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setOtpError('Enter the 6-digit verification code.');
      return;
    }
    if (otp !== generatedOtp) {
      setOtpError('Incorrect verification code. Please try again.');
      return;
    }
    loginUser(formData);
    navigate('/dashboard');
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    setOtp('');
    setOtpError('');
    setResendCooldown(30);
    console.log('VoxShield Demo OTP:', newOtp);
  };

  const handleBack = () => {
    setStep('details');
    setOtp('');
    setOtpError('');
    setGeneratedOtp('');
  };

  const capabilities = [
    {
      icon: Activity,
      title: 'Voice authenticity',
      description: 'Analyze speech for synthetic and manipulated audio signals.',
    },
    {
      icon: Shield,
      title: 'Risk intelligence',
      description: 'Translate detection results into actionable security risk.',
    },
    {
      icon: Check,
      title: 'Attack prevention',
      description: 'Recommend verification before sensitive actions proceed.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#080b10] text-slate-100 relative overflow-hidden">
      {/* Ambient background structure */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-220px] left-[-180px] w-[520px] h-[520px] rounded-full bg-emerald-500/[0.035] blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-180px] w-[600px] h-[600px] rounded-full bg-slate-400/[0.025] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      {/* Top brand bar */}
      <header className="relative z-10 px-6 sm:px-10 lg:px-14 pt-7">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center">
              <Shield className="w-[18px] h-[18px] text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-[0.18em] text-slate-100">
                VOXSHIELD
              </div>
              <div className="text-[9px] tracking-[0.16em] text-slate-500 uppercase mt-0.5">
                Voice Security Intelligence
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Secure environment
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 min-h-[calc(100vh-90px)] flex items-center px-6 sm:px-10 lg:px-14 py-14 lg:py-16">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 xl:gap-24 items-center">

            {/* LEFT — Product introduction with transcript */}
            <motion.section
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="max-w-xl"
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-[10px] font-medium tracking-[0.14em] uppercase text-slate-400 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Voice impersonation defense
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-5xl xl:text-[58px] leading-[1.03] font-semibold tracking-[-0.045em] text-slate-50">
                Trust the voice.
                <br />
                <span className="text-slate-400">Verify the decision.</span>
              </h1>

              <p className="mt-7 text-base sm:text-lg leading-7 text-slate-400 max-w-lg">
                VoxShield analyzes voice authenticity, evaluates interaction
                risk, and helps prevent high-impact impersonation attacks before
                sensitive actions are taken.
              </p>

              {/* Transcript Animation Component */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-8 rounded-xl px-4 py-3 border border-emerald-500/20 bg-emerald-500/[0.05] flex items-center gap-4 overflow-hidden"
              >
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-[0.12em] text-emerald-300/60 font-medium">
                    Live transcript
                  </span>
                </div>
                <div className="flex-1 text-sm font-mono tracking-wide text-slate-200/80 flex items-center gap-2 min-h-[24px]">
                  <AnimatePresence mode="wait">
                    {transcriptLines.map(
                      (line) =>
                        line.active && (
                          <motion.span
                            key={line.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35 }}
                            className="text-[13px] font-medium text-emerald-200/90"
                          >
                            {line.text}
                          </motion.span>
                        )
                    )}
                  </AnimatePresence>
                  <span className="w-1 h-4 bg-emerald-400/40 animate-pulse ml-1" />
                </div>
              </motion.div>

              {/* Capability list - ORIGINAL POINTS */}
              <div className="mt-10 space-y-3">
                {capabilities.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.15 + index * 0.08,
                      }}
                      className="group flex items-start gap-4 py-3"
                    >
                      <div className="w-9 h-9 shrink-0 rounded-lg border border-slate-800 bg-slate-900/70 flex items-center justify-center group-hover:border-emerald-500/30 transition-colors">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-200">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm leading-5 text-slate-500 max-w-md">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Product principle */}
              <div className="mt-10 pt-6 border-t border-slate-800/80">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Detection → Risk → Prevention
                </p>
              </div>
            </motion.section>

            {/* RIGHT — Login panel with OTP flow */}
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
              className="w-full max-w-md lg:ml-auto"
            >
              <div className="rounded-2xl border border-slate-800/90 bg-[#0d1118]/95 shadow-2xl shadow-black/30 overflow-hidden">

                {/* Panel header */}
                <div className="px-6 sm:px-7 pt-7 pb-6 border-b border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-emerald-400 font-medium">
                        {step === 'details' ? 'Secure session' : 'Identity verification'}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
                        {step === 'details' ? 'Welcome to VoxShield' : 'Verify your identity'}
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                      {step === 'details' ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <KeyRound className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-5 text-slate-500">
                    {step === 'details'
                      ? 'Identify yourself to begin a secure voice analysis session.'
                      : `Enter the verification code sent to ${formData.email}.`}
                  </p>
                </div>

                {/* DETAILS STEP */}
                {step === 'details' && (
                  <form onSubmit={handleSendOtp} className="px-6 sm:px-7 py-7 space-y-5">
                    {/* Full name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`w-full h-12 px-4 rounded-xl bg-slate-950/80 border ${
                          errors.name
                            ? 'border-red-500/70'
                            : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/60'
                        } text-sm text-slate-100 placeholder:text-slate-700 outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20`}
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-[11px] text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        Email address
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={`w-full h-12 px-4 rounded-xl bg-slate-950/80 border ${
                          errors.email
                            ? 'border-red-500/70'
                            : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/60'
                        } text-sm text-slate-100 placeholder:text-slate-700 outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20`}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-[11px] text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-2"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        Phone number
                      </label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full h-12 px-4 rounded-xl bg-slate-950/80 border ${
                          errors.phone
                            ? 'border-red-500/70'
                            : 'border-slate-800 hover:border-slate-700 focus:border-emerald-500/60'
                        } text-sm text-slate-100 placeholder:text-slate-700 outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20`}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-[11px] text-red-400">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group w-full h-12 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      Send verification code
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>
                )}

                {/* OTP STEP */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="px-6 sm:px-7 py-7">
                    {/* Demo OTP display */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.045] p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <KeyRound className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-400 font-medium">
                            Demo verification code
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            In production, this would be delivered via email or SMS.
                          </p>
                          <p className="mt-3 text-2xl font-mono font-bold tracking-[0.3em] text-slate-100">
                            {generatedOtp}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* OTP input */}
                    <div>
                      <label
                        htmlFor="otp"
                        className="text-xs font-medium text-slate-300"
                      >
                        Verification code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtp(value);
                          setOtpError('');
                        }}
                        placeholder="000000"
                        className={`mt-2 w-full h-14 rounded-xl bg-slate-950/80 border ${
                          otpError
                            ? 'border-red-500/70'
                            : 'border-slate-800 focus:border-emerald-500/60'
                        } text-center text-xl font-mono tracking-[0.45em] text-slate-100 placeholder:text-slate-700 outline-none transition-colors focus:ring-2 focus:ring-emerald-500/20`}
                      />
                      {otpError && (
                        <p className="mt-2 text-[11px] text-red-400">
                          {otpError}
                        </p>
                      )}
                    </div>

                    {/* Verify button */}
                    <button
                      type="submit"
                      disabled={otp.length !== 6}
                      className="group w-full h-12 mt-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                      Verify & Continue
                      <Check className="w-4 h-4 group-hover:scale-105 transition-transform" />
                    </button>

                    {/* Secondary actions */}
                    <div className="mt-5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Change details
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0}
                        className="flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-400 disabled:text-slate-700 transition-colors"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : 'Resend code'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Security footer */}
                <div className="px-6 sm:px-7 py-4 border-t border-slate-800/80 bg-slate-950/20">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-slate-600">
                      <Lock className="w-3 h-3 text-emerald-500/70" />
                      {step === 'details' ? 'Verification required' : 'Identity verification active'}
                    </div>
                    <span className="text-[10px] text-slate-700">VOXSHIELD</span>
                  </div>
                </div>
              </div>

              {/* Below-card note */}
              <p className="text-center mt-5 text-[10px] leading-4 text-slate-600">
                {step === 'details'
                  ? 'Your identification is used to associate analysis activity with the current application session.'
                  : 'Demo authentication is used for this prototype. Production deployment should use server-side OTP verification.'}
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </main>
  );
}