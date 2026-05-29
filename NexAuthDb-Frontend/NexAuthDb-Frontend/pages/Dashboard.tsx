// TeachDashboard.tsx
// Stack: React + TypeScript + react-router-dom + authStore

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import styles from './TeachDashboard.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem {
  icon: string;
  label: string;
  badge?: string;
  badgeColor?: 'blue' | 'green';
  active?: boolean;
  path?: string; // เพิ่มตัวเลือก Path สำหรับการเปลี่ยนหน้า
}

interface EventCard {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  color: 'white' | 'blue' | 'pink' | 'teal';
  avatars: string[];
  zoomBadge?: boolean;
  colIndex: number; // 0 = Mon … 5 = Sat
  topSlot: number;  // slot index (0 = 09:00, 1 = 10:00 …)
  spanSlots: number;
}

interface UpcomingEvent {
  id: number;
  title: string;
  category: string;
  time: string;
  emoji: string;
  bg: string;
}

interface TopCourse {
  id: number;
  title: string;
  author: string;
  emoji: string;
  bg: string;
}

interface CourseCard {
  id: number;
  title: string;
  author: string;
  emoji: string;
  bg: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { icon: '⊞', label: 'Dashboard', path: '/dashboard' },
  { icon: '◷', label: 'My Schedule', active: true, path: '/dashboard' },
  { icon: '💬', label: 'Chat', badge: '4', badgeColor: 'blue' },
  { icon: '📖', label: 'My Course' },
  { icon: '📊', label: 'My Status', badge: 'Pro', badgeColor: 'green' },
  { icon: '⭐', label: 'Reviews', badge: 'Pro', badgeColor: 'green' },
  { icon: '👤', label: 'My Account', path: '/profile' }, // เพิ่มพาทสำหรับเปลี่ยนไปหน้า Profile
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const DAYS = [
  { name: 'Mon', num: '02' },
  { name: 'Tue', num: '03' },
  { name: 'Wed', num: '04' },
  { name: 'Thu', num: '05' },
  { name: 'Fri', num: '06' },
  { name: 'Sat', num: '07' },
];

const EVENTS: EventCard[] = [
  {
    id: 1, title: 'UX Research Class', subtitle: 'Mon – Thu',
    time: '10:44 am', color: 'white', avatars: ['A', 'B', 'C'],
    colIndex: 0, topSlot: 1, spanSlots: 2,
  },
  {
    id: 2, title: 'App Development Course', subtitle: 'Mon – Thu',
    time: '10:44 am', color: 'blue', avatars: ['A', 'B'],
    colIndex: 0, topSlot: 3, spanSlots: 2,
  },
  {
    id: 3, title: 'Figma UI/UX Workshop', subtitle: 'Mon – Thu',
    time: '10:44 am', color: 'pink', avatars: ['A', 'B'],
    colIndex: 0, topSlot: 5, spanSlots: 2,
  },
  {
    id: 4, title: 'Webinar', subtitle: 'Mon – Thu',
    time: '10:44 am', color: 'teal', avatars: [],
    zoomBadge: true, colIndex: 5, topSlot: 1, spanSlots: 3,
  },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 1, title: 'Typography in UX/UI', category: 'Design', time: '10:00 am', emoji: '📝', bg: '#FAC775' },
  { id: 2, title: 'Figma UI UX Design',  category: 'Design', time: '10:00 am', emoji: '🎨', bg: '#F4C0D1' },
];

const TOP_COURSES: TopCourse[] = [
  { id: 1, title: 'CSS for Designers',     author: 'uxcel', emoji: '🎨', bg: '#B5D4F4' },
  { id: 2, title: '3D Design Foundations', author: 'uxcel', emoji: '🧊', bg: '#FAC775' },
  { id: 3, title: 'Design Composition',    author: 'uxcel', emoji: '💎', bg: '#F4C0D1' },
  { id: 4, title: 'Color Psychology',      author: 'uxcel', emoji: '🔵', bg: '#C0DD97' },
];

const COURSE_CARDS: CourseCard[] = [
  { id: 1, title: 'Portrait Photography Masterclass', author: 'Jone Copper', emoji: '📷', bg: '#FAC775' },
  { id: 2, title: 'User Interface Design Masterclass', author: 'Jone Copper', emoji: '🖥', bg: '#B5D4F4' },
];

const COURSE_TABS = ['All Course', 'One by One', 'Webinar', 'Personal Coaching', 'Workshop'];

const CALENDAR_DAYS = [
  [1,2,3,4,5,6,7],
  [8,9,10,11,12,13,14],
  [15,16,17,18,19,20,21],
  [22,23,24,25,26,27,28],
  [29,30,'',1,2,3,4],
];
const SELECTED_DAYS = [23, 27];
const RANGE_DAYS = [24, 25, 26];

// ─── Dynamic Style Maps ───────────────────────────────────────────────────────
const EVENT_COLORS: Record<string, React.CSSProperties> = {
  white: { background: '#fff', border: '0.5px solid #e0e0e0', color: '#222' },
  blue:  { background: '#378ADD', color: '#fff' },
  pink:  { background: '#D4537E', color: '#fff' },
  teal:  { background: '#1D9E75', color: '#fff' },
};

const SLOT_HEIGHT = 54; // px per time slot

// ─── Sub-components ───────────────────────────────────────────────────────────

// รับ Props onNavigate เพิ่มเติมเพื่อใช้เปลี่ยนเส้นทางผ่าน react-router-dom
function Sidebar({ 
  userName, 
  userRole, 
  onLogout, 
  onNavigate 
}: { 
  userName: string; 
  userRole: string; 
  onLogout: () => void; 
  onNavigate: (path: string) => void; 
}) {
  return (
    <div className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brandWrapper}>
        <div className={styles.brandLogo}>✦</div>
        <span className={styles.brandName}>Teach.</span>
      </div>

      {/* User */}
      <div className={styles.userWrapper}>
        <div className={styles.userAvatarLarge}>👩</div>
        <div>
          <div className={styles.userNameText}>{userName}</div>
          <div className={styles.userRoleText}>{userRole}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.navContainer}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            onClick={() => item.path && onNavigate(item.path)} // สั่งเปลี่ยนเส้นทางเมื่อมีข้อมูลฟิลด์ path
            className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.badge && (
              <span className={`${styles.navBadge} ${item.badgeColor === 'green' ? styles.badgeGreen : styles.badgeBlue}`}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Upload CTA */}
      <div className={styles.sidebarCta}>
        <div className={styles.ctaPlus}>＋</div>
        New Upload
      </div>

      {/* Logout */}
      <div onClick={onLogout} className={styles.logoutBtn}>
        ⎋ ออกจากระบบ
      </div>
    </div>
  );
}

// รับฟังก์ชันสลับหน้าเพื่อเอาไปฝังกับ Avatar มุมขวาบนตัวเล็กของ Topbar (กดแล้วไปหน้า Profile ได้เช่นกัน)
function Topbar({ userName, onAvatarClick }: { userName: string; onAvatarClick: () => void }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.searchBar}>
        🔍 Search
      </div>
      <button className={styles.uploadBtn}>
        ＋ New Upload
      </button>
      <div className={styles.topbarActions}>
        <span className={styles.actionIcon}>🔔</span>
        <span className={styles.actionIcon}>💬</span>
        <div className={styles.userAvatarSmall} onClick={onAvatarClick} style={{ cursor: 'pointer' }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className={styles.dropdownArrow}>▾</span>
      </div>
    </div>
  );
}

function ScheduleGrid() {
  return (
    <div className={styles.scheduleGrid}>
      {/* Header row */}
      <div className={styles.gridCorner} />
      {DAYS.map((d) => (
        <div key={d.num} className={styles.dayHeader}>
          <div className={styles.dayName}>{d.name}</div>
          <div className={styles.dayNum}>{d.num}</div>
        </div>
      ))}

      {/* Time column */}
      <div className={styles.timeColumn}>
        {TIME_SLOTS.map((t) => (
          <div key={t} className={styles.timeLabel}>{t}</div>
        ))}
      </div>

      {/* Day columns */}
      {DAYS.map((d, colIdx) => {
        const colEvents = EVENTS.filter(e => e.colIndex === colIdx);
        return (
          <div key={d.num} className={styles.dayColumn}>
            {/* Cell grid lines */}
            {TIME_SLOTS.map((t) => (
              <div key={t} className={styles.gridCell} />
            ))}

            {/* Events */}
            {colEvents.map((ev) => (
              <div
                key={ev.id}
                className={styles.eventCard}
                style={{
                  top: ev.topSlot * SLOT_HEIGHT + 3,
                  height: ev.spanSlots * SLOT_HEIGHT - 6,
                  ...EVENT_COLORS[ev.color],
                }}
              >
                <div>
                  <div className={styles.eventTitle}>{ev.title}</div>
                  <div className={styles.eventSubtitle}>{ev.subtitle}</div>
                  {ev.zoomBadge && (
                    <div className={styles.zoomBadge}>
                      📹 Zoom
                    </div>
                  )}
                </div>
                <div className={styles.eventFooter}>
                  {ev.avatars.length > 0 && (
                    <div className={styles.avatarGroup}>
                      {ev.avatars.map((a, i) => (
                        <div 
                          key={i} 
                          className={styles.eventAvatar}
                          style={{
                            background: ev.color === 'white' ? '#B5D4F4' : 'rgba(255,255,255,.35)',
                            marginLeft: i === 0 ? 0 : -5,
                            color: ev.color === 'white' ? '#185FA5' : '#fff',
                          }}
                        >
                          {a}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles.eventTime}>{ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function CourseTabs({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className={styles.tabsContainer}>
      {COURSE_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`${styles.tabBtn} ${active === tab ? styles.tabBtnActive : ''}`}
        >
          {tab}
          {active === tab && <span className={styles.tabDot} />}
        </button>
      ))}
    </div>
  );
}

function CourseCards() {
  return (
    <div className={styles.courseCardsGrid}>
      {COURSE_CARDS.map((c) => (
        <div key={c.id} className={styles.courseCard}>
          <div className={styles.courseEmojiBox} style={{ background: c.bg }}>
            {c.emoji}
          </div>
          <div>
            <div className={styles.courseTitle}>{c.title}</div>
            <div className={styles.courseAuthorRow}>
              <div className={styles.authorAvatar}>👩</div>
              <span className={styles.courseAuthorName}>{c.author}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  return (
    <div>
      <div className={styles.calendarHeader}>
        <span className={styles.calendarTitle}>February 2021</span>
        <div className={styles.calendarNav}>
          {['‹', '›'].map((c) => (
            <button key={c} className={styles.calNavBtn}>{c}</button>
          ))}
        </div>
      </div>
      <div className={styles.calendarGrid}>
        {DOW.map((d) => (
          <div key={d} className={styles.dowLabel}>{d}</div>
        ))}
        {CALENDAR_DAYS.map((week) =>
          week.map((day, i) => {
            const dayNum = typeof day === 'number' ? day : 0;
            const isEmpty = day === '';
            const isSelected = SELECTED_DAYS.includes(dayNum);
            const isRange = RANGE_DAYS.includes(dayNum);
            const isOther = typeof day !== 'number' && day !== '';
            
            // Dynamic calendar styles
            let calDayStyle: React.CSSProperties = {};
            if (isSelected) {
              calDayStyle = { background: '#378ADD', color: '#fff', fontWeight: 600, cursor: 'pointer' };
            } else if (isRange) {
              calDayStyle = { background: '#EBF3FF', color: '#185FA5', cursor: 'pointer' };
            } else if (isOther) {
              calDayStyle = { color: '#ccc', cursor: 'pointer' };
            } else if (isEmpty) {
              calDayStyle = { color: 'transparent', cursor: 'default' };
            } else {
              calDayStyle = { cursor: 'pointer' };
            }

            return (
              <div
                key={i}
                className={styles.calDay}
                style={calDayStyle}
              >
                {day}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div className={styles.rightPanel}>
      <MiniCalendar />

      {/* Upcoming Events */}
      <div>
        <div className={styles.panelSectionTitle}>Upcoming Events</div>
        {UPCOMING_EVENTS.map((ev) => (
          <div key={ev.id} className={styles.upcomingItem}>
            <div className={styles.upcomingEmojiBox} style={{ background: ev.bg }}>
              {ev.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.topCourseTitle}>{ev.title}</div>
              <div className={styles.upcomingMeta}>
                <span className={styles.upcomingMetaText}>• {ev.category}</span>
                <span className={styles.upcomingMetaText}>• {ev.time}</span>
              </div>
            </div>
            <span className={styles.moreIcon}>···</span>
          </div>
        ))}
      </div>

      {/* Top Performing Courses */}
      <div>
        <div className={styles.panelSectionHeader}>
          <div className={styles.calendarTitle}>Top Performing Courses</div>
          <span className={styles.moreIcon}>···</span>
        </div>
        {TOP_COURSES.map((c) => (
          <div key={c.id} className={styles.topCourseItem}>
            <div className={styles.topCourseEmojiBox} style={{ background: c.bg }}>
              {c.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.topCourseTitle}>{c.title}</div>
              <div className={styles.topCourseAuthor}>{c.author}</div>
            </div>
            <span className={styles.trendIcon}>∿</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeachDashboard() {
  const [activeTab, setActiveTab] = React.useState('All Course');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const userName = user?.fullName ?? 'Guest';
  const userRole = (user?.roles ?? []).join(', ') || 'User';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.container}>
      {/* ส่งฟังก์ชัน navigate ผ่าน props เพื่อให้ Sidebar จัดการเปลี่ยนหน้าเมื่อกดเมนูต่างๆ */}
      <Sidebar userName={userName} userRole={userRole} onLogout={handleLogout} onNavigate={navigate} />

      <div className={styles.mainContent}>
        {/* เพิ่ม Event เมื่อกด Avatar เล็กบน Topbar ให้เปิดหน้า Profile ได้ด้วย */}
        <Topbar userName={userName} onAvatarClick={() => navigate('/profile')} />

        <div className={styles.subContentLayout}>
          {/* Schedule + Courses */}
          <div className={styles.centerPanel}>
            {/* Header */}
            <div className={styles.panelHeader}>
              <h1 className={styles.panelTitle}>My Schedule</h1>
              <div className={styles.headerActions}>
                <span className={styles.dateRange}>02 – 08 March</span>
                {['‹', '›'].map((c) => (
                  <button key={c} className={styles.navArrowBtn}>{c}</button>
                ))}
                <div className={styles.timezoneBadge}>
                  🌐 GMT +06:00 Public Time ▾
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className={styles.gridContainer}>
              <ScheduleGrid />
            </div>

            {/* Course section */}
            <div className={styles.courseSection}>
              <CourseTabs active={activeTab} setActive={setActiveTab} />
              <CourseCards />
            </div>
          </div>

          <RightPanel />
        </div>
      </div>
    </div>
  );
}