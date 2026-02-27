import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, KeyRound, Anchor } from 'lucide-react';
import { sendResetOTP, resetPassword } from '../services/api';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            await sendResetOTP(normalizedEmail);
            setStep(2);
            setSuccess(t('otp_sent_success') || 'Reset code sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset code.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setError('');
        setLoading(true);
        try {
            const normalizedEmail = email.trim().toLowerCase();
            await resetPassword(normalizedEmail, otpCode, newPassword);
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-aqua-glow/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold tracking-widest uppercase">{t('back_to_login')}</span>
                </Link>

                <div className="glass-panel p-8 rounded-[40px] border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aqua-glow to-transparent" />

                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="inline-flex p-3 bg-white/5 rounded-2xl mb-4 shadow-inner"
                        >
                            <KeyRound className="w-8 h-8 text-aqua-glow" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-1 uppercase italic text-glow-aqua">
                            {step === 1 ? 'Reset' : 'Verify'} <span className="text-aqua-glow">{step === 1 ? 'Access' : 'Identity'}</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-light">
                            {step === 1
                                ? 'Secure entry recovery protocol initiated.'
                                : 'Enter your credentials to restore access.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-xs font-bold uppercase tracking-wider">{success}</p>
                                </div>
                            )}

                            <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword} className="space-y-4">
                                {step === 1 ? (
                                    <>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-aqua-glow transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 font-medium"
                                                placeholder="captain@aquanova.com"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl text-white font-black text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all uppercase tracking-widest mt-2"
                                        >
                                            {loading ? 'Transmitting...' : 'Send Recovery Code'}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative group">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-aqua-glow transition-colors" />
                                            <input
                                                type="text"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 font-bold tracking-widest text-center"
                                                placeholder="123456"
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-aqua-glow transition-colors" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 font-medium"
                                                placeholder="New Password"
                                                required
                                            />
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-aqua-glow transition-colors" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-aqua-glow/50 focus:ring-0 outline-none transition-all text-white placeholder:text-gray-600 font-medium"
                                                placeholder="Confirm Password"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-aqua-glow rounded-2xl text-white font-black text-base shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 transition-all uppercase tracking-widest mt-2"
                                        >
                                            {loading ? 'Updating...' : 'Restore Access'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full text-xs text-gray-500 hover:text-white transition-colors mt-2 font-bold tracking-wider uppercase"
                                        >
                                            Request New Code
                                        </button>
                                    </>
                                )}
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* UI Accents */}
            <div className="absolute top-10 right-10 flex gap-2 opacity-20 pointer-events-none">
                <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                <div className="w-1 h-1 bg-white rounded-full animate-ping delay-300" />
                <div className="w-1 h-1 bg-white rounded-full animate-ping delay-700" />
            </div>
            <div className="absolute bottom-10 left-10 text-[10px] font-mono text-white/10 pointer-events-none tracking-widest">
                PROTOCOL: PWD_RST_V2.0
            </div>
        </div>
    );
};

export default ForgotPassword;
