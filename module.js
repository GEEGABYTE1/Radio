const fetch = require('node-fetch')
const EpnsSDK = require("@epnsproject/backend-sdk-staging").default
require('dotenv').config()
const Web3 = require('web3')         
const web3 = new Web3(Web3.givenProvider || 'https://eth-goerli.gateway.pokt.network/v1/lb/62b7830e123e6f003984c794') 


class Radio {
    constructor(private_key) {
        this._epnssdk = new EpnsSDK(private_key)
        this._contract_holders = []

    }

    get sdk () {
        return this._epnssdk
    }

    get contract_holders () {
        return this.contract_holders
    }

    check_contract(contract) {
        const contract_status = web3.utils.isAddress(contract)
        return contract_status
    }

    async fetch_data(chainId, address, api_key, baseURL) {
        const url = new URL(`${baseURL}${chainId}/tokens/${address}/token_holders/?key=${api_key}`);
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;
        return data;
    }


    async connect_nft(nft_address, network) {
        const nft_validation = this.check_contract(nft_address)
        if (nft_validation === false) {
            throw new Error(`NFT Contract Address not valid - Contract Address: ${nft_address}`)
        } else {
            var chainId = undefined
            var validation = true
            const block_id = {'eth':'1', "poly":'137'} // 2 Providers
            if (network === 'eth') {
                chainId = block_id[network]
            } else if (network === 'poly') {
                chainId = block_id[network]
            } else {
                validation = false
                throw new Error(`Network ${network} is not a valid parameter`)
                
            }

            if (validation === true ) {
                const baseURL = 'https://api.covalenthq.com/v1/'
                const api_key = process.env.API_KEY
                const array = await fetch_data(chainId, nft_address, api_key, baseURL)
                this._contract_holders = array
            } else {
                return []
            }
        }
    }

    async sendm_sub (message_title, message_content, redirect_link) {
        const subscribers = this.fetch_subscribers()
        let subscriber_idx = 0 
        const message_title_verify = this.message_title_verification(message_title)
        if (message_title_verify[0] === false) {
            throw new Error(`${message_title} does not match word limit. Character Word Limit is ${message_title_verify[1]} instead of 20`)
        } else {
            const message_content_verify = this.message_content_verification(message_content)
            if (message_title_verify[0] === false) {
                throw new Error(`${message_content} does not match word limit. Character Word Limit is ${message_content_verify[1]} instead of 20`)
            } else {
                const notification_title = 'Announcement'
                const notification_content = this.notification_content(message_content)
                
            }   
        }

    }

    notification_content(message_content) {
        const message_content_lst = message_content.split('')
        var resulting_string = ''
        const half_length = message_content_lst / 2
        const message_split_lst = message_content_lst.slice(0, half_length)
        let idx = 0 
        for (idx; idx <= message_split_lst.length; idx++) {
            var letter = message_split_lst[idx]
            resulting_string += letter
        }
        return resulting_string
    }


    message_content_verification (message_content) {
        message_content_lst = message_content.split('')
        if (message_content_lst.length < 1 || message_content_lst.length > 85) {
            return [false, message_content_lst.length]
        } else {
            return true
        }
    }

    message_title_verification (message_title) {
        message_title_content = message_content.split('')
        if (message_title_content.length < 1 || message_title.length > 20) {
            return [false, message_title_content.length]
        } else {
            return true
        }
    }

    async fetch_subscribers() {
        const allSubscribers = await this._epnssdk.getSubscribedUsers()
        return allSubscribers
    }
    
    time () {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const seconds = date.getSeconds()
        const date_string = `0${month}/${day}/${year}`
        const time_string = `${hours}:${minutes}:${seconds}`
        return [date_string, time_string]

    }


}


radio = new Radio(process.env.PRIVATE_KEY)
console.log(radio.sdk)

