import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5245/api';

export default function ForgotPassword() {
  const [email, setEmail]       = useState('');
  const [sent, setSent]         = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState('');
  const [cooldown, setCooldown] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail ?? data.title ?? 'เกิดข้อผิดพลาด');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCooldown(true);
    setLoading(true);
    try {
      await fetch(`${BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 30_000);
    }
  };

  const S: Record<string, React.CSSProperties> = {
    page:  { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5', padding:'1rem' },
    wrap:  { display:'flex', width:'100%', maxWidth:700, borderRadius:12, overflow:'hidden', border:'0.5px solid #e0e0e0', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
    left:  { width:200, flexShrink:0, background:'#fafaf8', padding:'2rem 1.25rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' },
    right: { flex:1, background:'#fff', padding:'2rem 1.75rem', display:'flex', flexDirection:'column', justifyContent:'center' },
    back:  { display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#888', cursor:'pointer', marginBottom:'1.25rem', textDecoration:'none' },
    h2:    { fontSize:17, fontWeight:500, marginBottom:'0.75rem' },
    desc:  { fontSize:13, color:'#666', lineHeight:1.6, marginBottom:'1.25rem' },
    label: { display:'block', fontSize:12, color:'#666', marginBottom:5 },
    input: { width:'100%', padding:'7px 11px', border:'0.5px solid #ccc', borderRadius:8, fontSize:13 },
    btnM:  { width:'100%', padding:8, background:'#111', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', marginTop:4 },
    btnO:  { padding:'8px 16px', background:'#fff', border:'0.5px solid #ccc', borderRadius:8, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 },
    err:   { background:'#fef2f2', color:'#dc2626', padding:'8px 11px', borderRadius:8, fontSize:12, marginBottom:'0.85rem' },
    feat:  { display:'flex', gap:8, alignItems:'flex-start', width:'100%' },
    featIc:{ width:28, height:28, borderRadius:8, border:'0.5px solid #e0e0e0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13 },
    featT: { fontSize:12, color:'#666', lineHeight:1.5 },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.left}>
          <div style={{ fontSize:24, fontWeight:500 }}>N</div>
          <p style={{ fontSize:13, fontWeight:500, textAlign:'center' }}>ลืมรหัสผ่าน?</p>
          <p style={{ fontSize:11, color:'#888', textAlign:'center', lineHeight:1.6 }}>ไม่ต้องกังวล เราจะส่งลิงก์รีเซ็ตไปยังอีเมลของคุณ</p>
          <div style={{ width:'100%', borderTop:'0.5px solid #e5e5e5', paddingTop:'0.85rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[
              ['📬', 'ตรวจสอบ inbox และโฟลเดอร์ spam'],
              ['⏱',  'ลิงก์หมดอายุใน 15 นาที'],
              ['🔒', 'ใช้ได้ครั้งเดียวเพื่อความปลอดภัย'],
            ].map(([ic, txt]) => (
              <div key={txt} style={S.feat}>
                <div style={S.featIc}>{ic}</div>
                <div style={S.featT}>{txt}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.right}>
          <Link to="/login" style={S.back}>← กลับ</Link>

          {!sent ? (
            <>
              <h2 style={S.h2}>รีเซ็ตรหัสผ่าน</h2>
              <p style={S.desc}>กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้คุณ</p>
              {error && <div style={S.err}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom:'1rem' }}>
                  <label style={S.label}>อีเมล</label>
                  <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus />
                </div>
                <button type="submit" disabled={isLoading} style={S.btnM}>
                  {isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ต'}
                </button>
              </form>
              <p style={{ fontSize:12, color:'#888', textAlign:'center', marginTop:'1rem' }}>
                จำรหัสผ่านได้แล้ว? <Link to="/login" style={{ color:'#111', fontWeight:500 }}>เข้าสู่ระบบ</Link>
              </p>
            </>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', padding:'1rem 0' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>✉️</div>
              <p style={{ fontSize:16, fontWeight:500 }}>ส่งอีเมลแล้ว!</p>
              <p style={{ fontSize:13, color:'#666', textAlign:'center', lineHeight:1.7 }}>
                ตรวจสอบกล่องจดหมาย <strong>{email}</strong><br/>
                ลิงก์รีเซ็ตจะหมดอายุใน 15 นาที
              </p>
              <button onClick={handleResend} disabled={cooldown || isLoading} style={{ ...S.btnO, opacity: cooldown ? 0.5 : 1 }}>
                🔄 {cooldown ? 'ส่งแล้ว (รอ 30 วิ)' : 'ส่งใหม่อีกครั้ง'}
              </button>
              <Link to="/login" style={{ fontSize:12, color:'#888', marginTop:'0.5rem' }}>กลับหน้าเข้าสู่ระบบ</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
