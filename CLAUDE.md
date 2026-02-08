# Project: Factory Task Tracker (MVP)

**Goal:** React Native (Expo) cross-platform app for factory workers to view and complete tasks.
**Status:** Core MVP implemented. All priority screens and features are functional.

## Tech Stack

- **Framework:** React Native via Expo (SDK 54)
- **Language:** TypeScript (strict mode)
- **Styling:** Standard `StyleSheet`
- **Navigation:** Expo Router (file-based routing, Stack navigator)
- **Icons:** Ionicons (`@expo/vector-icons`)
- **Storage:** `@react-native-async-storage/async-storage` for user persistence
- **Animations:** `react-native-reanimated` (confetti effect on task completion)
- **SVG:** `react-native-svg` (logo component)

## Project Structure

```
app/                          # Expo Router (file-based routing)
├── _layout.tsx              # Root Stack navigator
├── index.tsx                # Entry point → LoginScreen
├── home.tsx                 # Dashboard route
├── profile.tsx              # Profile screen (inline)
└── tasks/
    ├── index.tsx            # Task list with search (inline)
    └── [id].tsx             # Task detail with status actions (inline)
components/
├── TransformersLogo.tsx     # SVG logo component
└── ConfettiAnimation.tsx    # Confetti on task completion (55 pieces, gravity + sway)
screens/
├── LoginScreen.tsx          # Email/password login (mock auth)
└── HomeScreen.tsx           # Dashboard with task stats
services/
├── mockApi.ts               # Mock API with 500ms delay (fetchTasks, fetchTaskById, updateTaskStatus)
└── userStore.ts             # AsyncStorage wrapper (setUser, getUser, loadUser, clear)
data/
└── mockTasks.ts             # 7 mock tasks with Ukrainian operations
```

## Data Structure

No backend yet. Mock data simulates the company's 1C ERP system.

```typescript
interface Task {
  id: string;
  vin: string;               // e.g., "MR0KB3CD700924519"
  model: string;             // e.g., "Toyota Hilux"
  operation: string;         // From "Тех операція" (e.g., "Бронювання кунгу")
  description: string;       // From "Коментарій" (e.g., "Комплект деталей 3,0 мм (355)")
  assignee: string;          // From "Робочий центр" (e.g., "Кушнір В.")
  status: 'pending' | 'in_progress' | 'done';
  startDate: string;         // ISO date
  deadline: string;          // ISO date
  materialReceived: boolean; // "Вимоги-накладні"
  orderNumber: string;       // e.g., "#195"
  post: string;              // e.g., "Пост 2"
  teamSize: number;          // Number of team members
}
```

## UI/UX Guidelines

### Visual Style (Dark Theme)
- Clean, industrial, modern
- Primary background: `#0A0A0A` (near-black)
- Card background: `#1A1A1A`
- Primary text: `#FFFFFF` (white)
- Secondary text: `#AAAAAA` (light grey)
- Borders: `#333333` / `#2A2A2A`
- Accent colors: `#E3000F` (red for logout/alerts), `#0057B8` (blue for interactive/start actions)

### Key Screens

**Login Screen:**
- Email and password inputs (mock auth, no real validation)
- Password visibility toggle
- Saves email to AsyncStorage on login
- Centered layout with TransformersLogo
- KeyboardAvoidingView for input handling

**Home Screen (Dashboard):**
- User rating display (hardcoded 1250 pts)
- Task completion stats (e.g., 4/5 tasks)
- Navigation cards to Tasks and Profile

**Task List Screen:**
- FlatList with card-based layout
- Search bar (filters by VIN, operation, order number, model, assignee)
- Pull-to-refresh support
- Colored left border (4px) by status
- Each card shows: order badge, VIN, operation, model, assignee (+teamSize), post
- Status icon per card (checkmark, timer, clock)
- Empty state: "Завдань не знайдено"

**Task Details Screen:**
- Status badge with color dot at top
- 7 info rows: model, VIN, assignee, post, start date, deadline, materials
- Full description section
- Bottom action buttons:
  - Pending → "Почати" (blue #0057B8)
  - In Progress → "Завершити" (green #4CAF50)
  - Done → "Завдання виконано" (disabled)
- Confetti animation on completion

**Profile Screen:**
- User avatar with online indicator
- Stats: tasks completed, points
- Menu items: Personal data, Achievements, Finance, Notifications, Settings (not functional in MVP)
- Logout button (red #E3000F)

### Accessibility for Factory Use
- Minimum touch target: 48x48px (all screens use 56px+)
- Font sizes: headings 20px+, body 16px+, labels 14px+
- High contrast (white text on dark background)
- No gestures required — all actions via visible buttons

## Development Guidelines

### Code Generation Rules
- Always use TypeScript with strict typing
- Keep components small and focused — one file per screen/component
- Use functional components with hooks only (no class components)
- All UI text hardcoded in Ukrainian
- Mock data in `data/` directory
- No over-engineering: skip abstractions, skip complex state management for MVP
- **Always wrap screens in `SafeAreaView`**
- **Always use `KeyboardAvoidingView`** for screens with text inputs
- **No external API calls.** All data goes through `services/mockApi.ts`
- When asked for a screen, generate the **full working code in one file**

### Mock API Pattern (`services/mockApi.ts`)
```typescript
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTasks = async (): Promise<Task[]> => { ... };
export const fetchTaskById = async (id: string): Promise<Task | undefined> => { ... };
export const updateTaskStatus = async (id: string, status: Task['status']): Promise<Task> => { ... };
```

### User Persistence (`services/userStore.ts`)
```typescript
export const userStore = {
  setUser(name: string): void;     // Save to AsyncStorage
  getUser(): string | null;        // Get cached user
  loadUser(): Promise<void>;       // Load from AsyncStorage on startup
  clear(): void;                   // Logout (clear storage)
};
```

### Styling Rules
- Use `StyleSheet.create()` for all styles
- Factory-friendly UI: large touch targets (min 48px), high contrast, readable fonts (16px+ base)
- Status colors: `pending` = `#9E9E9E` (grey), `in_progress` = `#FFC107` (yellow/gold), `done` = `#4CAF50` (green)
- Card borders: left border 4px with status color
- Keep layouts simple: flat lists, cards, minimal nesting
- Dark background (#0A0A0A), white text, bold headings, clean spacing

### Navigation Structure
```
/ (index.tsx) → LoginScreen
├── /home           — Dashboard with task stats and navigation
├── /tasks          — Task list with search
├── /tasks/[id]     — Task detail with status actions
└── /profile        — Worker profile and settings
```

Stack navigator only (no tab bar). Back navigation via header buttons.

### MVP Status
- [x] Task list screen with search/filter
- [x] Task detail screen with status change ("Почати" / "Завершити")
- [x] Login screen with email persistence
- [x] Dashboard with task counts
- [x] Profile screen with logout
- [x] Confetti animation on task completion
- [x] AsyncStorage user persistence
- [x] SafeAreaView on all screens

### Out of Scope for MVP
- Real backend / API integration
- Push notifications
- Offline sync
- Admin panel
- Complex role-based access
- Profile menu item functionality (Personal data, Achievements, etc.)

### Naming Conventions
- Files: `PascalCase.tsx` for components/screens, `camelCase.ts` for utilities/services
- Components: `PascalCase`
- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase` with descriptive names

### Testing
- Skip unit tests for MVP unless specifically requested
- Manual testing on iOS and Android simulators
- Focus on "does it render and navigate correctly"
