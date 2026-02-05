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

## Development Guidelines

### Code Generation Rules
- Always use TypeScript with strict typing
- Keep components small and focused — one file per screen/component
- Use functional components with hooks only (no class components)
- All UI text must support Ukrainian language (hardcoded strings in Ukrainian)
- Mock data goes in a dedicated `data/` or `mocks/` directory
- No over-engineering: skip abstractions, skip complex state management for MVP

### Styling Rules
- Use `StyleSheet.create()` for all styles
- Factory-friendly UI: large touch targets (min 48px), high contrast, readable fonts (16px+ base)
- Status colors: `pending` = yellow/orange, `in_progress` = blue, `done` = green
- Keep layouts simple: flat lists, cards, minimal nesting

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
