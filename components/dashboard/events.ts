// Small client-side event utility to notify dashboard components to refresh
export const DASHBOARD_CHANGED_EVENT = "dashboard:changed"

export function notifyDashboardChanged() {
  if (typeof window === "undefined") return
  try {
    window.dispatchEvent(new Event(DASHBOARD_CHANGED_EVENT))
  } catch (e) {
    // ignore
    console.debug("failed to dispatch dashboard changed event", e)
  }
}
