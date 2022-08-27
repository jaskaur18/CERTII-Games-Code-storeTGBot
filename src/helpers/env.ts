import * as dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'

//{ path: resolve(cwd(), '.env') }
dotenv.config()

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  TOKEN: str(),
  MONGO: str(),

  ADMIN_IDS: str(),
  RAILWAY_STATIC_URL: str(),

  APIRONE_WALLET_ID: str(),
  COINPAYMENTAPI_KEY: str(),
  COINPAYMENTAPI_SECRET: str(),
})
