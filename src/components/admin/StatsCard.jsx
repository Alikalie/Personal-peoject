import React from 'react'

export default function StatsCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
