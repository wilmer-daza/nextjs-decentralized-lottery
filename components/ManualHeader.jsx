import { useMoralis } from "react-moralis"
import { use, useEffect } from "react"

export default function ManualHeader() {
	const { enableWeb3, account, isWeb3Enabled, isWeb3EnableLoading, Moralis, deactivateWeb3 } = useMoralis()

	useEffect(() => {
		if (isWeb3Enabled) return

		if (typeof window !== "undefined") {
			if (window.localStorage.getItem("connected")) enableWeb3()
		}
	}, [isWeb3Enabled])

	useEffect(() => {
		Moralis.onAccountChanged((account) => {
			if (account == null) {
				window.localStorage.removeItem("connected")
				deactivateWeb3()
			}
		})
	}, [])
	//TODO: does the effect need [], no dependency array or account effect ???

	return (
		<h1>
			{account ? (
				<div>
					Connected to account: {account.slice(0, 6)}...{account.slice(account.length - 4)}
				</div>
			) : (
				<button
					onClick={async () => {
						await enableWeb3()
						if (typeof window !== "undefined") {
							window.localStorage.setItem("connected", "injected")
						}
					}}
					disabled={isWeb3EnableLoading}
				>
					Connect
				</button>
			)}
		</h1>
	)
}
