import React from 'react'

export default function AdminForm({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  )
}
