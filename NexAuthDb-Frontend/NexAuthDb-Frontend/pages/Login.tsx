// pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleGoogle = async (credResp: any) => {
    setError('');
    try {
      await googleLogin(credResp.credential);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-tertiary, #f5f5f0)', padding: '1rem' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 780, borderRadius: 12, overflow: 'hidden', border: '0.5px solid #e0e0e0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Left panel */}
        <div style={{ flex: 1, background: '#fafaf8', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
          <div style={{ fontSize: 28, fontWeight: 500 }}>NexAuth</div>
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 1.6 }}>แพลตฟอร์มที่ปลอดภัย<br/>สำหรับทุกการเชื่อมต่อ</p>
          {[
            ['🔒', 'ปลอดภัย', 'JWT + Refresh Token'],
            ['💬', 'Chat Real-time', 'ส่งข้อความ แผนที่ ไฟล์'],
            ['👥', 'User & Admin', 'แยก Role ชัดเจน'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', maxWidth: 220, width: '100%' }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                <strong style={{ color: '#111' }}>{title}</strong><br/>{desc}
              </div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, background: '#fff', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: '1.5rem' }}>เข้าสู่ระบบ</h2>

          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: 8, fontSize: 13, marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>อีเมล</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>รหัสผ่าน</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '8px 12px', border: '0.5px solid #ccc', borderRadius: 8, fontSize: 14 }} />
              <Link to="/forgot-password" style={{ fontSize: 12, color: '#888', float: 'right', marginTop: 4 }}>ลืมรหัสผ่าน?</Link>
            </div>
            <button type="submit" disabled={isLoading}
              style={{ padding: '9px', background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 }}>
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '1rem 0' }}>
            <div style={{ flex: 1, height: 0.5, background: '#e5e5e5' }} />
            <span style={{ fontSize: 12, color: '#aaa' }}>หรือ</span>
            <div style={{ flex: 1, height: 0.5, background: '#e5e5e5' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google login failed')} />
          </div>

          <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginTop: '1.25rem' }}>
            ยังไม่มีบัญชี? <Link to="/register" style={{ color: '#111', fontWeight: 500 }}>สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
}