# Project: Factory Task Tracker (MVP)

**Goal:** Build a React Native (Expo) cross-platform app for factory workers to view and complete tasks.
**Deadline:** Critical demo in 4 days. Prioritize speed and "it works" over perfection.

## Tech Stack

- **Framework:** React Native (via Expo)
- **Language:** TypeScript
- **Styling:** Standard `StyleSheet` (keep it simple and robust)
- **Navigation:** Expo Router (file-based routing) or React Navigation
- **Icons:** Ionicons or MaterialIcons (`@expo/vector-icons`)

## Data Structure (Mock Data)

We do NOT have a backend yet. We simulate data based on the company's 1C ERP system.
All components must use this data structure:

```typescript
interface Task {
  id: string;
  vin: string;               // e.g., "MR0KB3CD700924519"
  model: string;             // e.g., "Toyota Hilux"
  operation: string;         // From "Тех операція" column (e.g., "Бронювання кунгу")
  description: string;       // From "Коментарій" column (e.g., "Комплект деталей 3,0 мм (355)")
  assignee: string;          // From "Робочий центр" brackets (e.g., "Мельник Володимир")
  status: 'pending' | 'in_progress' | 'done'; // Based on "Статус"
  startDate: string;         // ISO date
  deadline: string;          // ISO date
  materialReceived: boolean; // Mock field for "Вимоги-накладні"
}
```

## UI/UX Guidelines

### Visual Style
- Clean, industrial but modern
- Quality benchmark: "Nova Poshta" app style (white background, bold text, red/blue accents)
- Primary background: `#FFFFFF` (white)
- Primary text: `#1A1A1A` (near-black, bold headings)
- Accent colors: `#E3000F` (red for actions/alerts), `#0057B8` (blue for interactive elements)
- Secondary background: `#F5F5F5` (light grey for cards/sections)

### Key Screens

**Login Screen:**
- Simple dropdown to select user (e.g., "Мельник", "Лесюк")
- No password needed for MVP
- Clean centered layout with app logo/title

**Task List Screen:**
- Card-based list layout
- Green left border for `done` tasks
- Yellow left border for `in_progress` tasks
- Grey/default border for `pending` tasks
- Each card shows: model, VIN (truncated), operation name, assignee, deadline

**Task Details Screen:**
- Big readable text for all fields
- Status badge at the top
- Full VIN, model, operation, description, dates displayed clearly
- "Завершити" (Complete) button fixed at the bottom
- "Почати" (Start) button for pending tasks

### Accessibility for Factory Use
- Minimum touch target: 48x48px
- Font sizes: headings 20px+, body 16px+, labels 14px+
- High contrast between text and background
- No gestures required — all actions via visible buttons

## Development Guidelines

### Code Generation Rules
- Always use TypeScript with strict typing
- Keep components small and focused — one file per screen/component
- Use functional components with hooks only (no class components)
- All UI text must support Ukrainian language (hardcoded strings in Ukrainian)
- Mock data goes in a dedicated `data/` or `mocks/` directory
- No over-engineering: skip abstractions, skip complex state management for MVP
- **Always wrap screens in `SafeAreaView`** to handle iPhone notch/Dynamic Island
- **Always use `KeyboardAvoidingView`** for any screen with text inputs
- **No external API calls.** Create `services/mockApi.ts` that returns dummy data with a simulated 500ms delay
- When asked for a screen, generate the **FULL working code in one file** so it can be copy-pasted directly

### Mock API Pattern (`services/mockApi.ts`)
```typescript
// All "API" calls go through here. Replace with real API later.
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTasks = async (): Promise<Task[]> => {
  await delay();
  return MOCK_TASKS; // from data/mockTasks.ts
};

export const updateTaskStatus = async (id: string, status: Task['status']): Promise<Task> => {
  await delay();
  // find and return updated task from mock data
};
```

### Styling Rules
- Use `StyleSheet.create()` for all styles
- Factory-friendly UI: large touch targets (min 48px), high contrast, readable fonts (16px+ base)
- Status colors: `pending` = `#FFA500` (orange), `in_progress` = `#FFD700` (yellow), `done` = `#4CAF50` (green)
- Card borders: left border 4px with status color
- Keep layouts simple: flat lists, cards, minimal nesting
- White background, bold headings, clean spacing

### Navigation Structure (Target)
```
/ (Home)
├── /tasks          — Task list with filters (by status, by assignee)
├── /tasks/[id]     — Task detail screen
└── /profile        — Worker profile / settings
```

### Priorities (MVP Scope)
1. Task list screen with status filtering
2. Task detail screen with status change ("Почати" / "Завершити")
3. Basic worker login (mock, select from list)
4. Simple dashboard with task counts by status

### Out of Scope for MVP
- Real backend / API integration
- Push notifications
- Offline sync
- Admin panel
- Complex role-based access

### Naming Conventions
- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities
- Components: `PascalCase`
- Variables/functions: `camelCase`
- Types/interfaces: `PascalCase` with descriptive names

### Testing
- Skip unit tests for MVP unless specifically requested
- Manual testing on iOS and Android simulators
- Focus on "does it render and navigate correctly"
