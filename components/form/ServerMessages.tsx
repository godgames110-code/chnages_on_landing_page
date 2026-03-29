"use client"

import * as React from "react"

export function ServerMessages({
  serverMessage,
  serverErrors,
}: {
  serverMessage?: string | null
  serverErrors?: Record<string, string[]>
}) {
  if (!serverMessage && (!serverErrors || Object.keys(serverErrors).length === 0)) {
    return null
  }

  return (
    <>
      {serverMessage && <p className="text-green-700 mt-2">{serverMessage}</p>}

      {serverErrors && Object.keys(serverErrors).length > 0 && (
        <div className="text-red-700 mt-2">
          {Object.entries(serverErrors).map(([k, v]) => (
            <div key={k}>
              <strong>{k}:</strong> {v.join(" ")}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default ServerMessages
