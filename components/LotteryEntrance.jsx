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

	const { runContractFunction: enterLottery } = useWeb3Contract({
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

	useEffect(() => {
		if (isWeb3Enabled) {
			async function updateUI() {
				const entranceFeeFromContract = (await getEntranceFee()).toString()
				const numPlayersFromContract = (await getNumPlayers()).toString()
				const recentWinnerFromContract = (await getRecentWinner()).toString()

				setEntranceFee(entranceFeeFromContract)
				setNumPlayers(numPlayersFromContract)
				setRecentWinner(recentWinnerFromContract)
			}
			updateUI()
		}
	}, [isWeb3Enabled])

	const handleSuccess = async function (tx) {
		await tx.wait(1)
		handleNotification()
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

	return lotteryAddress ? (
		<div>
			<br />
			Welcome to the Lottery !
			<br />
			<br />
			<button
				onClick={async function () {
					await enterLottery({
						onSuccess: handleSuccess,
						onError: (error) => console.log(error),
					})
				}}
			>
				Enter the Lottery
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
	)
}
