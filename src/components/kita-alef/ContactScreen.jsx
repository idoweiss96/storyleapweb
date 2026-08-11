import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageContext';

export default function ContactScreen({ onSubmit }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(isEn ? 'Please enter a valid email' : 'נא למלא מייל תקין');
      return;
    }
    if (!phone) {
      setError(isEn ? 'Please enter a phone number' : 'נא למלא מספר טלפון');
      return;
    }
    setError('');
    setSubmitting(true);
    try { await onSubmit(email, phone); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10 rounded-3xl" style={{ background: 'linear-gradient(135deg, #EAF8FD 0%, #FFF0F7 100%)' }}>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-md rounded-[24px] p-6 shadow-xl bg-white space-y-4"
        style={{ boxShadow: '0 10px 40px rgba(255,111,181,0.15), 0 4px 20px rgba(79,195,232,0.1)' }}
      >
        <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1A1A6E' }}>
          {isEn ? 'A few details before we start' : 'עוד כמה פרטים לפני שמתחילים'}
        </h2>
        <p className="text-sm text-center mb-2" style={{ color: '#6b6b8a' }}>
          {isEn ? "We'll send the finished story here" : 'נשלח למייל את הסיפור המוכן'}
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A6E' }}>
            {isEn ? 'Email' : 'מייל'} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg focus:outline-none"
            style={{ borderColor: '#F0E8F5' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: '#1A1A6E' }}>
            {isEn ? 'Phone' : 'טלפון'} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-0000000"
            className="w-full px-4 py-3 rounded-[10px] border bg-kita-input-bg focus:outline-none"
            style={{ borderColor: '#F0E8F5' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-[14px] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #4FC3E8, #FF6FB5)' }}
        >
          {isEn ? "Let's start together →" : 'בואו נתחיל יחד ←'}
        </button>
      </motion.form>
    </div>
  );
}