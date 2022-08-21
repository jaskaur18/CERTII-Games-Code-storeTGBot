import axios from 'axios'
import env from '@/helpers/env'

export async function createWallet(): Promise<string | false> {
  try {
    const walletAddress = await axios.request({
      method: 'POST',
      url: `https://apirone.com/api/v2/wallets/${env.APIRONE_WALLET_ID}/addresses`,
    })
    if (walletAddress.status === 200) {
      return walletAddress.data.address
    } else return false
  } catch (err) {
    console.log(err)
    return false
  }
}

//get n number usd to btc rate from blockchain.info
export async function getBtcRate(amount: number): Promise<number | false> {
  try {
    const rate = await axios.request({
      method: 'POST',
      url: `https://blockchain.info/tobtc?currency=USD&value=${amount}`,
    })
    if (rate.status === 200) {
      return rate.data
    } else return false
  } catch (err) {
    console.log(err)
    return false
  }
}

export const checkBTCPayment = async (address: string) => {
  try {
    const availableBalanace = await axios.request({
      url: `https://apirone.com/api/v2/wallets/${env.APIRONE_WALLET_ID}/addresses/${address}`,
      method: 'GET',
    })
    if (availableBalanace.status === 200) {
      return (
        parseFloat(`${availableBalanace.data.balance.available}`) * 0.00000001
      )
    }
    return false
  } catch (err) {
    console.log(err)
    return false
  }
}
