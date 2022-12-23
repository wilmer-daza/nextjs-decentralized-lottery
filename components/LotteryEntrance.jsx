import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
	const chainId = parseInt(chainIdHex)
	const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
	const [entranceFee, setEntranceFee] = useState("0")
	const [numPlayers, setNumPlayers] = useState("0")
	const [recentWinner, setRecentWinner] = useState("0")

	const dispatch = useNotification()

	const {
		runContractFunction: enterLottery,
		isFetching,
		isLoading,
	} = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "enterLottery",
		params: {},
		msgValue: entranceFee,
	})

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getEntranceFee",
		params: {},
	})

	const { runContractFunction: getNumPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getNumPlayers",
		params: {},
	})

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: lotteryAddress,
		functionName: "getRecentWinner",
		params: {},
	})

	async function updateUI() {
		const entranceFeeFromContract = (await getEntranceFee()).toString()
		const numPlayersFromContract = (await getNumPlayers()).toString()
		const recentWinnerFromContract = (await getRecentWinner()).toString()

		setEntranceFee(entranceFeeFromContract)
		setNumPlayers(numPlayersFromContract)
		setRecentWinner(recentWinnerFromContract)
	}

	useEffect(() => {
		if (isWeb3Enabled) {
			updateUI()
		}
	}, [isWeb3Enabled])

	const handleSuccess = async function (tx) {
		const txReceipt = await tx.wait(1)

		txReceipt.events[0].args
		console.log("§§§§§§§§§§§§§§§--------")
		console.log(txReceipt.events)

		handleNotification()
		updateUI()
	}

	const handleNotification = function () {
		dispatch({
			type: "info",
			message: "Transaction succeeded !!!",
			title: "You entered the Lottery !",
			position: "topR",
			icon: "bell",
		})
	}

	return (
		<div className="p-5">
			{lotteryAddress ? (
				<div>
					<br />
					Welcome to the Lottery !
					<br />
					<br />
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
						onClick={async function () {
							await enterLottery({
								onSuccess: handleSuccess,
								onError: (error) => console.log(error),
							})
						}}
						disabled={isFetching || isLoading}
					>
						{isLoading || isFetching ? (
							<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
						) : (
							"Enter the Lottery"
						)}
					</button>
					<br />
					<br />
					Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
					<br />
					Number of players: {numPlayers}
					<br />
					Recent Winner: {recentWinner}
				</div>
			) : (
				<div>No Lottery contract address has been detected !</div>
			)}
		</div>
	)
}
