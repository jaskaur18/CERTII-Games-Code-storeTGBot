import Coinpayments from 'coinpayments'
import env from '@/helpers/env'

const coinpaymentApi = new Coinpayments({
  key: env.COINPAYMENTAPI_KEY,
  secret: env.COINPAYMENTAPI_SECRET,
})

export const getMoneroDepositAddress = async () => {
  return (await coinpaymentApi.getDepositAddress({ currency: 'XMR' })).address
}

export default coinpaymentApi
