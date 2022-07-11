const fetch = require('node-fetch')
const EpnsSDK = require("@epnsproject/backend-sdk-staging").default
require('dotenv').config()
const Web3 = require('web3')         
const web3 = new Web3(Web3.givenProvider || 'https://eth-goerli.gateway.pokt.network/v1/lb/62b7830e123e6f003984c794') 


class Radio {
    constructor(private_key) {
        this._epnssdk = new EpnsSDK(private_key)

    }

    get sdk () {
        return this._epnssdk
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

    
    async fetch_subscribers() {
        const allSubscribers = await this._epnssdk.getSubscribedUsers()
        return allSubscribers
    }
    



}


radio = new Radio(process.env.PRIVATE_KEY)
console.log(radio.sdk)

