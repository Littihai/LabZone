import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import styles from './Profile.module.css';

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
  { icon: '◷', label: 'My Schedule', path: '/dashboard' },
  { icon: '💬', label: 'Chat', badge: '4', badgeColor: 'blue' as const },
  { icon: '📖', label: 'My Course' },
  { icon: '📊', label: 'My Status', badge: 'Pro', badgeColor: 'green' as const },
  { icon: '⭐', label: 'Reviews', badge: 'Pro', badgeColor: 'green' as const },
  { icon: '👤', label: 'My Account', path: '/profile' }, // ลิงก์มาหน้า Profile
];

function Sidebar({
  userName, userRole, onLogout, onNavigate,
}: {
  userName: string; userRole: string;
  onLogout: () => void; onNavigate: (path: string) => void;
}) {
  return (
    <div className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brandSection}>
        <div className={styles.brandLogo}>✦</div>
        <span className={styles.brandText}>Teach.</span>
      </div>

      {/* User */}
      <div className={styles.userSection}>
        <div className={styles.userAvatarThumbnail}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className={styles.userProfileName}>{userName}</div>
          <div className={styles.userProfileRole}>{userRole}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.navContainer}>
        {NAV_ITEMS.map((item) => {
          // หน้านี้ My Account จะเป็น Active
          const isActive = item.label === 'My Account';
          return (
            <div
              key={item.label}
              onClick={() => item.path && onNavigate(item.path)}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge && (
                <span className={`${styles.badge} ${item.badgeColor === 'green' ? styles.badgeGreen : styles.badgeBlue}`}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Upload CTA */}
      <div className={styles.uploadCta}>
        <div className={styles.uploadPlus}>＋</div>
        New Upload
      </div>

      {/* Logout */}
      <div onClick={onLogout} className={styles.logoutButton}>
        ⎋ ออกจากระบบ
      </div>
    </div>
  );
}

const MOCK_POSTS = Array(9).fill(null).map((_, i) => ({
  id: i,
  image: `https://picsum.photos/400/400?random=${i + 10}`,
}));

const MOCK_SAVED = Array(6).fill(null).map((_, i) => ({
  id: i,
  image: `https://picsum.photos/400/400?random=${i + 30}`,
}));

const STATS = [
  { value: '124', label: 'Posts' },
  { value: '1.2K', label: 'Followers' },
  { value: '890', label: 'Following' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<'posts' | 'saved' | 'tagged'>('posts');

  const userName = user?.fullName ?? 'Guest';
  const userRole = (user?.roles ?? []).join(', ') || 'User';
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      <Sidebar userName={userName} userRole={userRole} onLogout={handleLogout} onNavigate={navigate} />

      {/* Main area */}
      <div className={styles.mainArea}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            ← กลับ
          </button>
          <span className={styles.topbarTitle}>
            {userName.split(' ')[0]}
          </span>
          <button className={styles.settingsButton}>⚙</button>
        </div>

        <div className={styles.contentWrapper}>
          {/* Profile header card */}
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              {/* Avatar */}
              <div className={styles.avatarContainer}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={userName} className={styles.avatarImage} />
                ) : (
                  initial
                )}
              </div>

              {/* Info */}
              <div className={styles.infoContainer}>
                <div className={styles.profileName}>{userName}</div>
                <div className={styles.profileEmail}>{user?.email}</div>
                <div className={styles.roleBadge}>{userRole}</div>
              </div>

              {/* Action buttons */}
              <div className={styles.actionButtons}>
                <button className={styles.editButton}>✏ แก้ไขโปรไฟล์</button>
                <a
                  href="https://resume-yx72.vercel.app/#contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactButton}
                >
                  ↗ ติดต่อฉัน (Resume)
                </a>
              </div>
            </div>

            {/* Stats row */}
            <div className={styles.statsRow}>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={styles.statBox}
                  style={{ borderRight: i < STATS.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}
                >
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Resume link */}
            <div className={styles.resumeLinkRow}>
              <span className={styles.arrowIcon}>↗</span>
              <a
                href="https://resume-yx72.vercel.app/#contact"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resumeLink}
              >
                resume-yx72.vercel.app/#contact
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabsCard}>
            <div className={styles.tabsHeader}>
              {([
                { key: 'posts', icon: '⊞', label: 'โพสต์' },
                { key: 'saved', icon: '🔖', label: 'บันทึกไว้' },
                { key: 'tagged', icon: '👤', label: 'แท็ก' },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`${styles.tabTabButton} ${tab === t.key ? styles.tabButtonActive : ''}`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {tab === 'posts' && (
              <div className={styles.gridContainer}>
                {MOCK_POSTS.map((p) => (
                  <div key={p.id} className={styles.gridItem}>
                    <img src={p.image} alt="" className={styles.gridImage} />
                  </div>
                ))}
              </div>
            )}

            {tab === 'saved' && (
              <div className={styles.gridContainer}>
                {MOCK_SAVED.map((p) => (
                  <div key={p.id} className={styles.gridItem}>
                    <img src={p.image} alt="" className={styles.gridImage} />
                  </div>
                ))}
              </div>
            )}

            {tab === 'tagged' && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📷</div>
                <div className={styles.emptyText}>ยังไม่มีโพสต์ที่แท็ก</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}