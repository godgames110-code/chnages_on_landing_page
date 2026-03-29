// Re-export canonical cash flow chart implementation from `components/ui`.
export { CashFlowChart } from "./ui/cash-flow-chart"
export { CashFlowChart as default } from "./ui/cash-flow-chart"

// This keeps existing imports like `import { CashFlowChart } from "@/components/cash-flow-chart"`
// and `import CashFlowChart from "@/components/cash-flow-chart"` working while the
// implementation lives in `components/ui/cash-flow-chart.tsx`.
