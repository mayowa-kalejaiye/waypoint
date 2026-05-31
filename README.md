# Waypoint Frontend

A modern, responsive Next.js application that provides an intuitive interface for generating personalized learning curricula. Built with TypeScript, Tailwind CSS, and optimized for performance and accessibility.

## Overview

The frontend enables users to:
- Input learning goals in natural language
- View generated curricula with structured learning paths
- Watch integrated video content
- Track learning progress
- Provide feedback on content
- Access their learning history

## Technology Stack

- **Framework**: Next.js 14.2.5 (React 18.3.1)
- **Language**: TypeScript 6.0.3
- **Styling**: Tailwind CSS 3.4.10
- **UI Components**: Lucide React (icons)
- **Animation**: Framer Motion 12.38.0
- **Build Tool**: Node.js with npm

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── api/                # API routes (if needed)
│   │   └── curriculum/         # Curriculum pages
│   │
│   ├── components/             # Reusable React components
│   │   ├── CurriculumView.jsx  # Main curriculum display
│   │   ├── DayCard.tsx         # Individual day card
│   │   ├── VideoPlayer.tsx     # Video playback component
│   │   ├── GoalInput.jsx       # Goal input form
│   │   ├── ProgressSidebar.tsx # Progress tracking
│   │   ├── Leaderboard.tsx     # User leaderboard
│   │   ├── GeneratingScreen.tsx # Loading state
│   │   ├── HowItWorks.tsx      # Feature explanation
│   │   └── ...                 # Other components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCurriculum.ts    # Curriculum data fetching
│   │   └── useProgress.ts      # Progress tracking
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── curriculum.ts       # Curriculum types
│   │
│   ├── lib/                    # Utility functions
│   │   └── api.ts              # API client setup
│   │
│   ├── utils/                  # Helper functions
│   │   └── formatting.ts       # Text formatting utilities
│   │
│   ├── api/                    # API integration
│   │   └── waypoint.js         # Backend API client
│   │
│   └── global.d.ts             # Global TypeScript definitions
│
├── public/                     # Static assets
├── next.config.mjs             # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies
└── DESIGN.md                   # Design system documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ (18.17 or later)
- npm or yarn package manager
- Backend API running on configured URL

### Installation

1. Navigate to frontend directory:
```bash
cd waypoint/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

4. Start development server:
```bash
npm run dev
```

Application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Environment Configuration

### Development Environment (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENVIRONMENT=development
```

### Production Environment
```
NEXT_PUBLIC_API_URL=https://api.waypoint.com
NEXT_PUBLIC_ENVIRONMENT=production
```

Environment variables prefixed with `NEXT_PUBLIC_` are accessible in the browser.

## Component Architecture

### Page Components

#### Home Page (`src/app/page.tsx`)
Entry point for users. Features:
- Hero section with value proposition
- Goal input form
- Feature showcase
- Testimonials and results

#### Curriculum Page (`src/app/curriculum/[id]/page.tsx`)
Displays generated curriculum. Includes:
- Learning path overview
- Weekly breakdown
- Daily tasks with videos
- Progress tracking

### Reusable Components

#### GoalInput
Accepts user learning goals and submits to backend.
```tsx
<GoalInput onSubmit={handleGoalSubmit} isLoading={isGenerating} />
```

#### CurriculumView
Displays full curriculum structure with navigation.
```tsx
<CurriculumView curriculum={data} onVideoSelect={handleVideoClick} />
```

#### DayCard
Individual day card showing learning tasks for a specific day.
```tsx
<DayCard week={1} day={1} topics={topics} videos={videos} />
```

#### VideoPlayer
Embedded video player with transcript display.
```tsx
<VideoPlayer videoId={videoId} transcript={transcript} />
```

#### ProgressSidebar
Shows overall progress through curriculum.
```tsx
<ProgressSidebar 
  currentWeek={1} 
  currentDay={3} 
  totalWeeks={4}
  completedDays={5}
/>
```

#### GeneratingScreen
Loading state during curriculum generation.
```tsx
<GeneratingScreen goal={goal} status={status} progress={45} />
```

## Custom Hooks

### useCurriculum
Fetches and manages curriculum data.
```typescript
const { curriculum, isLoading, error } = useCurriculum(curriculumId);
```

### useProgress
Tracks and updates learning progress.
```typescript
const { progress, completeDay, completeWeek } = useProgress(curriculumId);
```

### useSession
Manages user session data.
```typescript
const { sessionId, isValid } = useSession();
```

## API Integration

### Backend Client (`src/api/waypoint.js`)

All API calls are centralized for consistency:

```typescript
// Generate curriculum
const result = await api.generateCurriculum({
  goal: "Learn Python",
  level: "beginner"
});

// Fetch curriculum
const curriculum = await api.getCurriculum(curriculumId);

// Submit feedback
await api.submitFeedback({
  curriculumId,
  videoId,
  rating: 4,
  helpful: true
});

// Track interactions
await api.trackInteraction({
  sessionId,
  eventType: "video_watched",
  metadata: { videoId, duration: 600 }
});
```

### Error Handling

API responses are validated and errors are caught:

```typescript
try {
  const curriculum = await api.getCurriculum(id);
} catch (error) {
  if (error.status === 404) {
    // Handle not found
  } else if (error.status === 429) {
    // Handle rate limit
  } else {
    // Handle other errors
  }
}
```

## Styling System

### Tailwind CSS

The project uses Tailwind CSS for styling with custom configuration:

```javascript
// tailwind.config.js configuration includes:
- Custom color palette
- Responsive breakpoints
- Custom font sizes
- Animation utilities
```

### Global Styles

Global CSS is in `src/app/globals.css`:
- Base typography
- Color variables
- Utility classes
- Animation keyframes

### Component Styles

Components use inline Tailwind classes for styling:

```tsx
<div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600">
  <h1 className="text-2xl font-bold text-white">Curriculum</h1>
</div>
```

### CSS Modules (Optional)

For complex styling, use CSS modules:

```tsx
import styles from './component.module.css';

export default function Component() {
  return <div className={styles.container}>Content</div>;
}
```

## State Management

The frontend uses React Hooks for state management:

### Context API
For global state (theme, user session):
```typescript
<SessionProvider>
  <App />
</SessionProvider>
```

### Local State
Component-level state with `useState`:
```typescript
const [curriculum, setCurriculum] = useState(null);
const [isLoading, setIsLoading] = useState(false);
```

### Side Effects
Data fetching with `useEffect`:
```typescript
useEffect(() => {
  fetchCurriculum();
}, [curriculumId]);
```

## Performance Optimization

### Image Optimization
Next.js Image component for automatic optimization:
```tsx
import Image from "next/image";

<Image
  src="/curriculum-bg.jpg"
  alt="Curriculum background"
  width={1200}
  height={600}
  priority
/>
```

### Code Splitting
Next.js automatically splits code per route:
- Each page is a separate bundle
- Dynamic imports for large components

### Lazy Loading
Components load on demand:
```tsx
const VideoPlayer = dynamic(() => import('./VideoPlayer'), {
  loading: () => <SkeletonCard />
});
```

### Caching Strategy
- Static pages cached at build time
- ISR (Incremental Static Regeneration) for dynamic content
- Client-side caching with custom hooks

## TypeScript Configuration

### Strict Mode Enabled
- All variables must be typed
- Null/undefined checks required
- Implicit `any` not allowed

### Type Definitions

Global types in `src/global.d.ts`:
```typescript
interface Curriculum {
  id: string;
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
  weeks: Week[];
  createdAt: Date;
}

interface Week {
  weekNumber: number;
  days: Day[];
}

interface Day {
  dayNumber: number;
  topics: string[];
  videos: Video[];
}
```

## Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile-First Approach
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid layout */}
</div>
```

## Accessibility

### Best Practices Implemented
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Alt text for all images

### Example
```tsx
<button
  aria-label="Play video"
  className="focus:outline-none focus:ring-2"
>
  Play
</button>
```

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Self-Hosted

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` directory:
```bash
npm start
```

### Docker

Build and run with Docker:
```bash
docker build -t waypoint-frontend:latest .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=... waypoint-frontend:latest
```

## Development Workflow

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Tasks

### Adding a New Page

1. Create file in `src/app/`:
```bash
touch src/app/new-page/page.tsx
```

2. Add page component:
```tsx
export default function NewPage() {
  return <main>New Page Content</main>;
}
```

3. Next.js automatically creates the route

### Creating a New Component

1. Create file in `src/components/`:
```bash
touch src/components/NewComponent.tsx
```

2. Implement component with TypeScript:
```tsx
interface NewComponentProps {
  title: string;
  onAction: () => void;
}

export default function NewComponent({ title, onAction }: NewComponentProps) {
  return <div>{title}</div>;
}
```

### Calling Backend API

Use centralized API client:
```typescript
import api from '@/api/waypoint';

const data = await api.getCurriculum(id);
```

### Handling Loading States

Use loading state in components:
```tsx
const [isLoading, setIsLoading] = useState(false);

const handleClick = async () => {
  setIsLoading(true);
  try {
    await api.generateCurriculum(goal);
  } finally {
    setIsLoading(false);
  }
};
```

## Troubleshooting

### Build Errors

**"Module not found" error**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**TypeScript errors**
```bash
# Run type checker
npm run type-check
```

### Runtime Errors

**API connection failed**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Check browser console for CORS errors

**Videos not loading**
- Verify video IDs are valid
- Check YouTube content is accessible
- Check network requests in DevTools

### Performance Issues

**Slow page load**
- Check Network tab in DevTools
- Look for large image files
- Verify API responses are fast

**Build takes too long**
- Check for unnecessary dependencies
- Reduce JavaScript bundle size
- Use dynamic imports for large components

## Best Practices

### Component Organization
- Keep components focused and single-purpose
- Use descriptive names
- Extract reusable logic into custom hooks
- Prop drilling limits: max 3 levels, then use Context

### Code Quality
- Write TypeScript types for all props
- Use ESLint configuration
- Follow Tailwind naming conventions
- Keep components under 300 lines

### Performance
- Lazy load heavy components
- Memoize expensive computations
- Use `useCallback` for event handlers
- Optimize images with Next.js Image

### Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Test with keyboard navigation
- Ensure color contrast is sufficient

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`

### Before Submitting PR
```bash
# Type check
npm run type-check

# Lint code
npm run lint

# Build production
npm run build
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

See the [main README](../README.md) for project overview and the [Backend README](../backend/README.md) for backend documentation.
