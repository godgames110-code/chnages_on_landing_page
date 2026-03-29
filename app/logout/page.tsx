"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
// use client-side fetch to call the internal API route

export default function LogoutPage() {
	const router = useRouter()

	useEffect(() => {
		let mounted = true

		async function doLogout() {
			try {
				// chama a rota interna do Next que por sua vez chama o backend
				await fetch('/api/logout', { method: 'POST' })
			} catch (err) {
				console.error('Erro ao desconectar:', err)
			} finally {
				if (mounted) router.push('/login')
			}
		}

		doLogout()

		return () => {
			mounted = false
		}
	}, [router])

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm text-center">
				<p className="text-lg">Desconectando…</p>
			</div>
		</div>
	)
}

