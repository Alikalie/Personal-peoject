import React from 'react'
import { NavLink } from 'react-router-dom'

const menus = [
  { name: 'Dashboard', path: '' },
  { name: 'Matches', path: 'matches' },
  { name: 'Daily Predictions', path: 'predictions' },
  { name: 'Past Predictions', path: 'past' },
  { name: 'VIP Plans', path: 'vip' },
  { name: 'VIP Requests', path: 'vip-requests' },
  { name: 'Users', path: 'users' },
  { name: 'Comments', path: 'comments' },
  { name: 'Contacts', path: 'messages' },
  { name: 'Footer Settings', path: 'footer-settings' },
  { name: 'Site Settings', path: 'site-settings' },
  { name: 'Admin Settings', path: 'admin-settings' },
]

export default function AdminSidebar() {
  return (
    <aside className="space-y-4">
      {menus.map((m) => (
        <NavLink key={m.path} to={m.path} className={({isActive}) => isActive ? 'block px-4 py-2 rounded bg-sky-500 text-black' : 'block px-4 py-2 rounded hover:bg-slate-100'} end={m.path === ''}>
          {m.name}
        </NavLink>
      ))}
    </aside>
  )
}
