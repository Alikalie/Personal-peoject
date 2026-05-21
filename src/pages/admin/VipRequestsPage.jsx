import React from 'react'
import VipPlansTable from '../../components/admin/VipPlansTable'

export default function VipRequestsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">VIP Requests</h2>
      <div className="mt-4"><VipPlansTable /></div>
    </div>
  )
}
import React from 'react'

export default function VipRequestsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">VIP Requests</h2>
      <p className="text-sm text-slate-600 mt-2">Approve or reject VIP access requests.</p>
    </div>
  )
}
