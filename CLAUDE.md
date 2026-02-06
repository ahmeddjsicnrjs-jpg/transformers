# Project: Transformers — Factory Task Tracker

**Goal:** React Native (Expo) cross-platform app for factory workers to view and complete production tasks.
**Status:** MVP ~85% ready. Core user flow (login → dashboard → tasks → task details) is functional.

## Tech Stack

- **Framework:** React Native via Expo SDK 54
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router v6 (file-based routing, Stack navigator)
- **Icons:** Ionicons + MaterialCommunityIcons (`@expo/vector-icons`)
- **Storage:** `@react-native-async-storage/async-storage` (user session persistence)
- **Styling:** `StyleSheet.create()` — no external UI libraries
- **SVG:** `react-native-svg` (logo component)

## Project Structure

```
app/                        # Expo Router — file-based routing
├── _layout.tsx             # Root Stack navigator (headerShown: false)
├── index.tsx               # Entry → LoginScreen
├── home.tsx                # Dashboard (HomeScreen)
├── profile.tsx             # User profile & settings
└── tasks/
    ├── index.tsx           # Task list with search
    └── [id].tsx            # Task detail with status actions
screens/
├── LoginScreen.tsx         # Email/password login (mock auth)
└── HomeScreen.tsx          # Dashboard: shift timer, stats, navigation
components/
└── TransformersLogo.tsx    # SVG logo component
services/
├── mockApi.ts              # Simulated API: fetchTasks, fetchTaskById, updateTaskStatus
└── userStore.ts            # User session: setUser, getUser, loadUser, clear
data/
└── mockTasks.ts            # Task interface + 7 mock tasks
```

## Data Structure

Backend not connected. Mock data simulates the company's 1C ERP system.

```typescript
interface Task {
  id: string;
  vin: string;               // e.g., "MR0KB3CD700924519"
  model: string;             // e.g., "Toyota Hilux"
  operation: string;         // Тех операція (e.g., "Бронювання кунгу")
  description: string;       // Коментарій (e.g., "Комплект деталей 3,0 мм (355)")
  assignee: string;          // Робочий центр (e.g., "Кушнір В.")
  status: 'pending' | 'in_progress' | 'done';
  startDate: string;         // ISO date
  deadline: string;          // ISO date
  materialReceived: boolean; // Вимоги-накладні
  orderNumber: string;       // e.g., "#195"
  post: string;              // e.g., "Пост 2"
  teamSize: number;          // Number of workers in team
}
```

## Navigation Flow

```
/ (LoginScreen)  — email/password, mock auth, saves email to AsyncStorage
  └── /home (HomeScreen) — dashboard: shift timer, task stats, navigation cards
        ├── /tasks         — task list: search by VIN/operation/model/assignee, pull-to-refresh
        │   └── /tasks/[id] — task detail: full info, status actions (Почати/Завершити)
        └── /profile       — user profile, menu items, logout
```

- Login → Home uses `router.replace()` (no swipe-back to login)
- All other navigation uses `router.push()` / `router.back()`
- Profile icon in top-right header of HomeScreen (no bottom tab bar)

## Visual Style — Dark Theme

The app uses a **dark industrial theme** (not white as originally planned).

### Colors
| Role | Color | Usage |
|------|-------|-------|
| Background | `#0A0A0A` | All screens |
| Card background | `#1A1A1A` | Cards, sections |
| Card border | `#333333` | Subtle borders |
| Text primary | `#FFFFFF` | Headings, body |
| Text secondary | `#AAAAAA` | Labels, hints |
| Accent blue | `#0057B8` | "Почати" button, interactive |
| Accent red | `#E3000F` | Logout, alerts |
| Status done | `#4CAF50` | Green |
| Status in_progress | `#FFC107` | Yellow/gold |
| Status pending | `#9E9E9E` | Grey |

### Typography
- Headers: 20-24px, fontWeight 700-800, letterSpacing 0.5-1.5
- Body: 14-16px, fontWeight 400-600
- Labels: 12-14px, fontWeight 600, uppercase with letterSpacing

## Implemented Screens

### LoginScreen (`screens/LoginScreen.tsx`)
- Email input + password input (with show/hide toggle)
- No real auth validation (MVP)
- Saves email to `userStore` → navigates to `/home`
- `SafeAreaView` + `KeyboardAvoidingView`

### HomeScreen (`screens/HomeScreen.tsx`)
- Header: logo, app title, rating badge (1250), notification bell, profile icon
- Active shift card: live timer (auto-increments), task count (4/5), efficiency (98%)
- "Завдання" card → navigates to `/tasks`

### TasksScreen (`app/tasks/index.tsx`)
- Header: back button, "ВИРОБНИЧИЙ ПЛАН" title, profile icon
- Search bar: filters by VIN, operation, orderNumber, model, assignee (case-insensitive)
- FlatList with pull-to-refresh
- Task cards: order badge, VIN, operation, model, assignee+teamSize, status border (4px left)
- Loading/empty states

### TaskDetailScreen (`app/tasks/[id].tsx`)
- Status badge + order number
- Operation title, description
- Info card: model, full VIN, assignee+teamSize, post, dates (DD.MM.YYYY), material status
- Bottom action buttons:
  - Pending → "Почати" (blue) → transitions to in_progress
  - In progress → "Завершити" (green) → transitions to done
  - Done → "Завдання виконано" indicator

### ProfileScreen (`app/profile.tsx`)
- Avatar with online indicator
- Username from `userStore`
- Stats: tasks count, points
- Menu items (non-functional): Особисті дані, Досягнення, Фінанси, Сповіщення, Налаштування
- Logout button → clears session → back to login

## Mock API (`services/mockApi.ts`)

All "API" calls with simulated 500ms delay. Replace with real API later.

```typescript
fetchTasks(): Promise<Task[]>                           // All tasks
fetchTaskById(id: string): Promise<Task | undefined>    // Single task
updateTaskStatus(id: string, status): Promise<Task>     // Update status (in-memory only)
```

**Note:** Status changes are in-memory only — they reset on app restart.

## Development Guidelines

### Code Rules
- TypeScript with strict typing
- Functional components + hooks only
- One file per screen/component
- All UI text in Ukrainian (hardcoded)
- `SafeAreaView` on every screen (`edges: ['top', 'left', 'right']`)
- `KeyboardAvoidingView` on screens with text inputs
- `StyleSheet.create()` for all styles
- Min touch targets: 48x48px
- No over-engineering: no abstractions, no complex state management

### Naming Conventions
- Files: `kebab-case.tsx` (components), `camelCase.ts` (utilities)
- Components: `PascalCase`
- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase`

### Testing
- Manual testing on iOS/Android simulators
- Focus: "does it render and navigate correctly"

## Known Limitations / Not Yet Done

- [ ] Filter button on tasks screen (UI exists, logic not wired)
- [ ] Profile menu items (UI exists, not functional)
- [ ] Notification bell (UI only)
- [ ] "Forgot password?" link (non-functional)
- [ ] Status changes not persisted (reset on restart)

## Out of Scope for MVP

- Real backend / 1C ERP API integration
- Push notifications
- Offline sync
- Admin panel
- Role-based access control
- Unit tests
