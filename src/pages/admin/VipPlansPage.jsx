import React from 'react'
import VipPlansTable from '../../components/admin/VipPlansTable'

export default function VipPlansPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">VIP Plans</h2>
      <div className="mt-4"><VipPlansTable /></div>
    </div>
  )
}
import React from 'react'

export default function VipPlansPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">VIP Plans</h2>
      <p className="text-sm text-slate-600 mt-2">Create and manage VIP subscription plans.</p>
    </div>
  )
}
