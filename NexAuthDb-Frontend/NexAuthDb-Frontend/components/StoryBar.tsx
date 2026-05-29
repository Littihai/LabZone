import Avatar from '@mui/material/Avatar'

const stories = [
  { id: 1, username: 'your_story', image: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, username: 'john', image: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, username: 'mike', image: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, username: 'anna', image: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, username: 'jane', image: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, username: 'tom', image: 'https://i.pravatar.cc/150?img=6' },
]

function StoryBar() {
  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        padding: '12px 10px',
        gap: '14px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
      }}
    >
      {stories.map((story) => (
        <div
          key={story.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: '72px',
          }}
        >
          {/* Gradient Ring แบบ IG */}
          <div
            style={{
              padding: '2px',
              borderRadius: '50%',
              background:
                'linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
            }}
          >
            <Avatar
              src={story.image}
              sx={{
                width: 62,
                height: 62,
                border: '2px solid white',
              }}
            />
          </div>

          <span
            style={{
              fontSize: '11px',
              marginTop: '6px',
              maxWidth: '70px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {story.username}
          </span>
        </div>
      ))}
    </div>
  )
}

export default StoryBar