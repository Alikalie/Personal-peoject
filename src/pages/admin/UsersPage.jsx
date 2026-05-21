import React from 'react'
import UsersTable from '../../components/admin/UsersTable'

export default function UsersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="mt-4"><UsersTable /></div>
    </div>
  )
}
import React from 'react'

export default function UsersPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>
      <p className="text-sm text-slate-600 mt-2">Manage platform users and roles.</p>
    </div>
  )
}
