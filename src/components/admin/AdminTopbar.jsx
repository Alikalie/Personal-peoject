import React from 'react'

export default function AdminTopbar({ title = 'Dashboard' }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="text-sm text-slate-600">Welcome, Admin</div>
    </div>
  )
}
