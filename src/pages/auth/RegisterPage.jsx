import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

export default function RegisterPage() {
	const [allowed, setAllowed] = useState(null)

	useEffect(() => {
		async function check() {
			try {
				const { data } = await supabase.from("site_settings").select("allow_registration").maybeSingle()
				setAllowed(Boolean(data?.allow_registration))
			} catch (err) {
				console.warn("Failed to check registration settings", err)
				setAllowed(true)
			}
		}
		check()
	}, [])

	if (allowed === null) return <div>Checking registration settings...</div>
	if (!allowed) return <div className="auth-disabled">Registration is temporarily disabled.</div>

	return <div>RegisterPage</div>
}