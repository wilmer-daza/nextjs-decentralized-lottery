import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "../styles/Home.module.css"

import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
	return (
		<div>
			<Head>
				<title>Decentrilized Lottery - Smart Contract</title>
				<meta name="description" content="An example of descentralized Lottery" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<LotteryEntrance />
		</div>
	)
}
