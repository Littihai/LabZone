import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

interface Props { children: React.ReactNode; }

export default function PrivateRoute({ children }: Props) {
  const { user, accessToken, refresh } = useAuthStore();
  const [checking, setChecking] = useState(!user); // ถ้ายังไม่มี user ให้รอก่อน

  useEffect(() => {
    // ถ้ามี refreshToken แต่ accessToken หมดอายุ — ลอง refresh ก่อน redirect
    if (!user && !accessToken) {
      const rt = useAuthStore.getState().refreshToken;
      if (rt) {
        refresh().finally(() => setChecking(false));
      } else {
        setChecking(false);
      }
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #e5e5e5', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}