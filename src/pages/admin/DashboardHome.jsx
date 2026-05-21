import React from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import AdminTopbar from '../../components/admin/AdminTopbar'
import StatsCard from '../../components/admin/StatsCard'
import DashboardCard from '../../components/admin/DashboardCard'

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-2">
        <AdminSidebar />
      </div>
      <div className="col-span-10 space-y-6">
        <AdminTopbar />
        <div className="grid grid-cols-3 gap-4">
          <StatsCard title="Matches" value={24} />
          <StatsCard title="Predictions" value={120} />
          <StatsCard title="Users" value={1024} />
        </div>
        <DashboardCard>
          <p className="text-slate-600">Overview and quick actions.</p>
        </DashboardCard>
      </div>
    </div>
  )
}
import React from 'react'

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Dashboard Home</h2>
      <p className="text-sm text-slate-600 mt-2">Overview and statistics cards will appear here.</p>
    </div>
  )
}
