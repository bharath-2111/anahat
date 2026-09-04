import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { validateLoginData } from '../utils/validators';
import { Shield, User, Phone, Mail, ArrowRight, Lock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Login() {
  const { userData, loginUser } = useAnalysis();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    email: userData?.email || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateLoginData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    loginUser(formData);
    navigate('/analyze');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 bg-tech-grid">
      <div className="max-w-md w-full">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 border border-emerald-500/80 rounded-lg flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-xl">
            <Shield className="w-10 h-10" />
          </div>
          
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded uppercase">
            OPERATOR IDENTIFICATION
          </span>

          <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-100 mt-3 tracking-tight">
            AURA-VOICE DEFENSE
          </h1>

          <p className="text-xs font-sans text-slate-400 mt-2 leading-relaxed">
            AI-powered synthetic voice detection & acoustic deepfake defense portal. Identify operator details before proceeding to voice signal analysis.
          </p>
        </div>

        {/* Identification Form Card */}
        <Card title="Operator Verification" subtitle="Enter credentials for session audit logging">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                FULL NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
                  errors.name ? 'border-red-600' : 'border-slate-800 focus:border-emerald-500'
                } rounded text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.name && (
                <p className="text-[11px] font-mono text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. alex.m@security-lab.io"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
                  errors.email ? 'border-red-600' : 'border-slate-800 focus:border-emerald-500'
                } rounded text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.email && (
                <p className="text-[11px] font-mono text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                PHONE NUMBER
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 019-2834"
                className={`w-full px-3.5 py-2.5 bg-slate-950 border ${
                  errors.phone ? 'border-red-600' : 'border-slate-800 focus:border-emerald-500'
                } rounded text-sm text-slate-100 font-mono placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.phone && (
                <p className="text-[11px] font-mono text-red-400 mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                icon={ArrowRight}
              >
                PROCEED TO ANALYZER
              </Button>
            </div>
          </form>

          {/* System Footer Note */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> LOCAL SESSION ACTIVE
            </span>
            <span>RESTRICTED ACCESS</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
