import React from 'react'
import MatchesTable from '../../components/admin/MatchesTable'

export default function MatchesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Matches</h2>
      <div className="mt-4"><MatchesTable /></div>
    </div>
  )
}
import React from 'react'

export default function MatchesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Matches Manager</h2>
      <p className="text-sm text-slate-600 mt-2">Add, edit or delete matches here.</p>
    </div>
  )
}
