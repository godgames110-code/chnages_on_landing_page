// Barrel file for top-level components
export { ActionButtons } from "./action-buttons"
export { StatsCards } from "./stats-cards"
export { DashboardHeader } from "./dashboard-header"
export { CashFlowChart } from "./cash-flow-chart"
export { Transactions } from "./transactions"

// Note: prefer importing directly from specific paths (e.g. "@/components/ui/button")
// to avoid ambiguity between `components/` and `components/ui/` variants. This barrel
// provides a convenience layer and now points to the top-level canonical files.
