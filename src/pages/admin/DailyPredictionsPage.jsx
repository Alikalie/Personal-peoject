import React from 'react'
import PredictionsTable from '../../components/admin/PredictionsTable'

export default function DailyPredictionsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Daily Predictions</h2>
      <div className="mt-4"><PredictionsTable /></div>
    </div>
  )
}
import React from 'react'

export default function DailyPredictionsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Daily Predictions</h2>
      <p className="text-sm text-slate-600 mt-2">Manage active multi-match tickets here.</p>
    </div>
  )
}
