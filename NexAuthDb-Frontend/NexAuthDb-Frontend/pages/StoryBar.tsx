// src/components/StoryBar.tsx
import * as React from 'react';
import { Box, Avatar, Typography, Stack } from '@mui/material';

// Mock story data
const stories = [
  { id: 1, username: 'your_story', avatar: 'https://i.pravatar.cc/150?img=1', hasStory: true },
  { id: 2, username: 'john_doe', avatar: 'https://i.pravatar.cc/150?img=2', hasStory: true },
  { id: 3, username: 'jane_smith', avatar: 'https://i.pravatar.cc/150?img=3', hasStory: true },
  { id: 4, username: 'bob_wilson', avatar: 'https://i.pravatar.cc/150?img=4', hasStory: false },
  { id: 5, username: 'alice_johnson', avatar: 'https://i.pravatar.cc/150?img=5', hasStory: true },
  { id: 6, username: 'charlie_brown', avatar: 'https://i.pravatar.cc/150?img=6', hasStory: true },
];

function StoryBar() {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #ddd',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        py: 2,
        px: 1,
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Stack direction="row" spacing={2} sx={{ display: 'inline-flex' }}>
        {stories.map((story) => (
          <Box
            key={story.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Avatar
              src={story.avatar}
              sx={{
                width: 64,
                height: 64,
                border: story.hasStory ? '3px solid #e4405f' : 'none',
                padding: '2px'
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, fontSize: '12px' }}>
              {story.username.length > 10 
                ? story.username.substring(0, 10) + '...' 
                : story.username}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default StoryBar;