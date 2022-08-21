/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import axios from 'axios'
import crypto from 'crypto'

export default class Coinbase {
  api_key: any
  api_secret: any
  baseUrl: string
  timestamp: () => number
  headers: (message: any) => Promise<{
    'Content-Type': string
    'CB-ACCESS-SIGN': any
    'CB-ACCESS-TIMESTAMP': any
    'CB-ACCESS-KEY': any
    'CB-VERSION': string
  }>
  getAccount: (account_id: any) => Promise<any>
  getAccounts: (args: { limit: any }) => Promise<any>
  getAddresses: (account_id: any) => Promise<any>
  getAddress: (account_id: any, address_id: any) => Promise<any>
  createAddress: (
    account_id: any,
    args: {
      name: any
    }
  ) => Promise<any>
  getTransaction: (
    account_id: any,
    address_id: any,
    transaction_id: any
  ) => Promise<any>
  getTransactions: (
    account_id: any,
    address_id: any,
    args: {
      limit: any
    }
  ) => Promise<any>
  sendMoney: (account_id: any, args: any) => Promise<any>
  getDeposit: (account_id: any, deposit_id: any) => Promise<any>
  getDeposits: (
    account_id: any,
    args: {
      limit: any
    }
  ) => Promise<any>
  getExchangeRates: (currency: any) => Promise<any>
  verifyCallback: (body: crypto.BinaryLike, signature: string) => any
  /**
   *
   * @param {String} api_key
   * @param {String} api_secret
   */
  constructor(api_key: any, api_secret: any) {
    this.api_key = api_key
    this.api_secret = api_secret

    this.baseUrl = 'https://api.coinbase.com'
    this.timestamp = function () {
      return Math.floor(Date.now() / 1000)
    }

    /**
     *
     * @param {any} message
     * @returns {Promise<any>}
     */
    this.headers = async function (message: any) {
      const signature = await this.signature(message)
      const timestamp = this.timestamp()
      return {
        'Content-Type': 'application/json',
        'CB-ACCESS-SIGN': signature,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-KEY': this.api_key,
        'CB-VERSION': '2015-07-22',
      }
    }

    /**
     *
     * @param {String} message
     * @returns {Promise<String>}
     */
    this.signature = function (message: crypto.BinaryLike) {
      return crypto
        .createHmac('sha256', this.api_secret)
        .update(message)
        .digest('hex')
    }
    /**
     *
     * @param {String} account_id
     * @returns {Promise<any>}
     */
    this.getAccount = async function (account_id: any) {
      try {
        const method = 'GET'
        const path = `/v2/accounts/${account_id}`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {Object} args
     * @returns
     */
    this.getAccounts = async function (args: { limit: any }) {
      try {
        const method = 'GET'
        const path =
          args && args.limit
            ? `/v2/accounts?limit=${args.limit}`
            : `/v2/accounts`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @returns
     */
    this.getAddresses = async function (account_id: any) {
      try {
        const method = 'GET'
        const path = `/v2/accounts/${account_id}/addresses`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {String} address_id
     * @returns
     */
    this.getAddress = async function (account_id: any, address_id: any) {
      try {
        const method = 'GET'
        const path = `/v2/accounts/${account_id}/addresses/${address_id}`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {any} args
     * @returns
     */
    this.createAddress = async function (account_id: any, args: { name: any }) {
      try {
        const method = 'POST'
        const path = `/v2/accounts/${account_id}/addresses`
        const data = args && args.name ? args : {}
        const body = JSON.stringify(data)
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.post(this.baseUrl + path, body, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {String} address_id
     * @param {String} transaction_id
     * @returns
     */
    this.getTransaction = async function (
      account_id: any,
      address_id: any,
      transaction_id: any
    ) {
      try {
        const method = 'GET'
        const path = `/v2/accounts/${account_id}/addresses/${address_id}/transactions/${transaction_id}`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {String} address_id
     * @param {any} args
     * @returns
     */
    this.getTransactions = async function (
      account_id: any,
      address_id: any,
      args: { limit: any }
    ) {
      try {
        const method = 'GET'
        const path =
          args && args.limit
            ? `/v2/accounts/${account_id}/addresses/${address_id}/transactions?limit=${args.limit}`
            : `/v2/accounts/${account_id}/addresses/${address_id}/transactions`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {any} args
     * @returns
     */
    this.sendMoney = async function (account_id: any, args: any) {
      try {
        const method = 'POST'
        const path = `/v2/accounts/${account_id}/transactions`
        const body = JSON.stringify(args)
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.post(this.baseUrl + path, body, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {String} deposit_id
     * @returns
     */
    this.getDeposit = async function (account_id: any, deposit_id: any) {
      try {
        const method = 'GET'
        const path = `/v2/accounts/${account_id}/deposits/${deposit_id}`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} account_id
     * @param {any} args
     * @returns
     */
    this.getDeposits = async function (account_id: any, args: { limit: any }) {
      try {
        const method = 'GET'
        const path =
          args && args.limit
            ? `/v2/accounts/${account_id}/deposits?limit=${args.limit}`
            : `/v2/accounts/${account_id}/deposits`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {String} currency
     * @returns
     */
    this.getExchangeRates = async function (currency: any) {
      try {
        const method = 'GET'
        const path = `/v2/exchange-rates?currency=${currency}`
        const body = ''
        const timestamp = await this.timestamp()
        const message = timestamp + method + path + body
        const headers = await this.headers(message)

        const response = await axios.get(this.baseUrl + path, {
          headers: headers,
        })
        return response.data
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
    /**
     *
     * @param {*} body
     * @param {*} signature
     * @returns
     */
    this.verifyCallback = function (
      body: crypto.BinaryLike,
      signature: string
    ) {
      try {
        const callback_key = `-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA9MsJBuXzFGIh/xkAA9Cy\nQdZKRerV+apyOAWY7sEYV/AJg+AX/tW2SHeZj+3OilNYm5DlBi6ZzDboczmENrFn\nmUXQsecsR5qjdDWb2qYqBkDkoZP02m9o9UmKObR8coKW4ZBw0hEf3fP9OEofG2s7\nZ6PReWFyQffnnecwXJoN22qjjsUtNNKOOo7/l+IyGMVmdzJbMWQS4ybaU9r9Ax0J\n4QUJSS/S4j4LP+3Z9i2DzIe4+PGa4Nf7fQWLwE45UUp5SmplxBfvEGwYNEsHvmRj\nusIy2ZunSO2CjJ/xGGn9+/57W7/SNVzk/DlDWLaN27hUFLEINlWXeYLBPjw5GGWp\nieXGVcTaFSLBWX3JbOJ2o2L4MxinXjTtpiKjem9197QXSVZ/zF1DI8tRipsgZWT2\n/UQMqsJoVRXHveY9q9VrCLe97FKAUiohLsskr0USrMCUYvLU9mMw15hwtzZlKY8T\ndMH2Ugqv/CPBuYf1Bc7FAsKJwdC504e8kAUgomi4tKuUo25LPZJMTvMTs/9IsRJv\nI7ibYmVR3xNsVEpupdFcTJYGzOQBo8orHKPFn1jj31DIIKociCwu6m8ICDgLuMHj\n7bUHIlTzPPT7hRPyBQ1KdyvwxbguqpNhqp1hG2sghgMr0M6KMkUEz38JFElsVrpF\n4z+EqsFcIZzjkSG16BjjjTkCAwEAAQ==\n-----END PUBLIC KEY-----`

        const verifier = crypto.createVerify('RSA-SHA256')
        verifier.update(body)
        return verifier.verify(callback_key, signature, 'base64')
      } catch (error: any) {
        return error.response && error.response.data
          ? error.response.data
          : error
      }
    }
  }
  signature(message: any) {
    throw new Error('Method not implemented.')
  }
}

module.exports = Coinbase
