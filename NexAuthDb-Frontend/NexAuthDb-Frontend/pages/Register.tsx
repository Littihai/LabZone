import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin, isLoading } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showCf, setShowCf]       = useState(false);
  const [error, setError]         = useState('');

  const strength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8)            s++;
    if (/[A-Z]/.test(pw))          s++;
    if (/[0-9]/.test(pw))          s++;
    if (/[^A-Za-z0-9]/.test(pw))  s++;
    return s;
  };
  const strengthLabel = ['', 'อ่อน', 'พอใช้', 'ดี', 'แข็งแกร่ง'];
  const strengthColor = ['', '#f87171', '#fb923c', '#facc15', '#4ade80'];
  const s = strength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8)   { setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'); return; }
    if (password !== confirm)   { setError('รหัสผ่านไม่ตรงกัน'); return; }
    try {
      await register(email, `${firstName} ${lastName}`.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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

  const S: Record<string, React.CSSProperties> = {
    page:   { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5', padding:'1rem' },
    wrap:   { display:'flex', width:'100%', maxWidth:780, borderRadius:12, overflow:'hidden', border:'0.5px solid #e0e0e0', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' },
    left:   { width:220, flexShrink:0, background:'#fafaf8', padding:'2rem 1.5rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' },
    right:  { flex:1, background:'#fff', padding:'2rem 1.75rem', display:'flex', flexDirection:'column', justifyContent:'center' },
    h2:     { fontSize:17, fontWeight:500, marginBottom:'1.25rem' },
    row2:   { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:'0.85rem' },
    field:  { marginBottom:'0.85rem' },
    label:  { display:'block', fontSize:12, color:'#666', marginBottom:5 },
    input:  { width:'100%', padding:'7px 11px', border:'0.5px solid #ccc', borderRadius:8, fontSize:13 },
    inputPw:{ width:'100%', padding:'7px 36px 7px 11px', border:'0.5px solid #ccc', borderRadius:8, fontSize:13 },
    btnMain:{ width:'100%', padding:8, background:'#111', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', marginTop:4 },
    btnOut: { width:'100%', padding:8, background:'#fff', border:'0.5px solid #ccc', borderRadius:8, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7 },
    or:     { display:'flex', alignItems:'center', gap:8, margin:'0.85rem 0' },
    orLine: { flex:1, height:0.5, background:'#e5e5e5' },
    linkRow:{ fontSize:12, color:'#888', textAlign:'center' as const, marginTop:'1rem' },
    err:    { background:'#fef2f2', color:'#dc2626', padding:'8px 11px', borderRadius:8, fontSize:12, marginBottom:'0.85rem' },
    feat:   { display:'flex', gap:8, alignItems:'flex-start', width:'100%' },
    featIc: { width:28, height:28, borderRadius:8, border:'0.5px solid #e0e0e0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    featT:  { fontSize:12, color:'#666', lineHeight:1.5 },
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.left}>
          <div style={{ fontSize:26, fontWeight:500 }}>N</div>
          <p style={{ fontSize:14, fontWeight:500, textAlign:'center', lineHeight:1.4 }}>สร้างบัญชีใหม่</p>
          <p style={{ fontSize:12, color:'#888', textAlign:'center', lineHeight:1.6 }}>เริ่มต้นใช้งาน NexAuth<br/>ได้ฟรีวันนี้</p>
          <div style={{ width:'100%', borderTop:'0.5px solid #e5e5e5', paddingTop:'0.85rem' }}>
            <p style={{ fontSize:11, color:'#aaa', lineHeight:1.7 }}>
              การสมัครสมาชิกแสดงว่าคุณยอมรับ{' '}
              <Link to="/terms" style={{ color:'#888' }}>ข้อกำหนดการใช้งาน</Link> และ{' '}
              <Link to="/privacy" style={{ color:'#888' }}>นโยบายความเป็นส่วนตัว</Link>
            </p>
          </div>
        </div>

        <div style={S.right}>
          <h2 style={S.h2}>สมัครสมาชิก</h2>
          {error && <div style={S.err}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={S.row2}>
              <div>
                <label style={S.label}>ชื่อ</label>
                <input style={S.input} type="text" placeholder="สมชาย" value={firstName} onChange={e=>setFirstName(e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>นามสกุล</label>
                <input style={S.input} type="text" placeholder="ใจดี" value={lastName} onChange={e=>setLastName(e.target.value)} />
              </div>
            </div>

            <div style={S.field}>
              <label style={S.label}>อีเมล</label>
              <input style={S.input} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>

            <div style={S.field}>
              <label style={S.label}>รหัสผ่าน</label>
              <div style={{ position:'relative' }}>
                <input style={S.inputPw} type={showPw?'text':'password'} placeholder="อย่างน้อย 8 ตัวอักษร" value={password} onChange={e=>setPassword(e.target.value)} required />
                <span onClick={()=>setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:14, color:'#aaa' }}>
                  {showPw ? '🙈' : '👁'}
                </span>
              </div>
              {password && (
                <>
                  <div style={{ background:'#eee', borderRadius:2, height:3, marginTop:5 }}>
                    <div style={{ width:`${s*25}%`, height:'100%', background:strengthColor[s], borderRadius:2, transition:'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize:11, color:strengthColor[s], marginTop:3 }}>{strengthLabel[s]}</div>
                </>
              )}
            </div>

            <div style={S.field}>
              <label style={S.label}>ยืนยันรหัสผ่าน</label>
              <div style={{ position:'relative' }}>
                <input style={{ ...S.inputPw, borderColor: confirm && confirm!==password ? '#f87171' : '#ccc' }}
                  type={showCf?'text':'password'} placeholder="••••••••" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
                <span onClick={()=>setShowCf(!showCf)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', cursor:'pointer', fontSize:14, color:'#aaa' }}>
                  {showCf ? '🙈' : '👁'}
                </span>
              </div>
              {confirm && confirm!==password && <div style={{ fontSize:11, color:'#f87171', marginTop:3 }}>รหัสผ่านไม่ตรงกัน</div>}
            </div>

            <button type="submit" disabled={isLoading} style={S.btnMain}>
              {isLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
            </button>
          </form>

          <div style={S.or}><div style={S.orLine}/><span style={{ fontSize:11, color:'#bbb' }}>หรือ</span><div style={S.orLine}/></div>
          <div style={{ display:'flex', justifyContent:'center' }}>
            <GoogleLogin onSuccess={handleGoogle} onError={()=>setError('Google login failed')} />
          </div>
          <div style={S.linkRow}>มีบัญชีแล้ว? <Link to="/login" style={{ color:'#111', fontWeight:500 }}>เข้าสู่ระบบ</Link></div>
        </div>
      </div>
    </div>
  );
}
