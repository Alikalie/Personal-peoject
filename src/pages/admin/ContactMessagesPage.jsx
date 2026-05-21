import React from 'react'
import ContactTable from '../../components/admin/ContactTable'

export default function ContactMessagesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Contact Messages</h2>
      <div className="mt-4"><ContactTable /></div>
    </div>
  )
}
import React from 'react'

export default function ContactMessagesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Contact Messages</h2>
      <p className="text-sm text-slate-600 mt-2">Support inbox for contact messages.</p>
    </div>
  )
}
