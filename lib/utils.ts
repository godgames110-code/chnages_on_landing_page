import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"

// Map backend category strings to select option values used in the UI
export function mapCategoryToOptionValue(type: string, raw?: string) {
  const cat = (raw || "").toString().toLowerCase()
  if (!cat) return ""
  if (type === "income") {
    if (cat.includes("salary")) return "salary"
    if (cat.includes("freelance")) return "freelance"
    if (cat.includes("invest")) return "investment"
    return "other"
  }
  // expense mapping: map common backend values to the select option values
  if (cat.includes("grocer") || cat.includes("food") || cat.includes("alimen")) return "groceries"
  if (cat.includes("util")) return "utilities"
  if (cat.includes("transport")) return "transportation"
  if (cat.includes("shop") || cat.includes("shopping")) return "shopping"
  if (cat.includes("health") || cat.includes("saude") || cat.includes("healthcare")) return "healthcare"
  if (cat.includes("entertain")) return "entertainment"
  return "other"
}
