// Barrel for UI components used across the app (only exports files that exist under `components/ui`)
// Many UI primitives (card, input, etc.) live under components/ui, but
// some composite components live at the components root. Export those
// with correct relative paths.
export { StatsCards } from "../stats-cards"
export { DashboardHeader } from "../dashboard-header"
export { CashFlowChart } from "../cash-flow-chart"
export { ThemeProvider } from "../theme-provider"
export { RecentTransactions } from "../recent-transactions"
export { Card } from "./card"

// NOTE: `ActionButtons` is a top-level composite component (components/action-buttons.tsx)
// and intentionally kept out of the ui primitives barrel to avoid circular/incorrect imports.
