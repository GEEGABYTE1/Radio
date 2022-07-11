import fetch from "node-fetch"
import promptSync from 'prompt-sync';
const prompt = promptSync();
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider || 'https://eth-goerli.gateway.pokt.network/v1/lb/62b7830e123e6f003984c794')
import 'dotenv/config'
//import express from 'express'

async function fetch_data(chainId, address, api_key, baseURL) {
    const url = new URL(`${baseURL}${'1'}/tokens/${address}/token_holders/?key=${api_key}`);
    const response = await fetch(url);
    const result = await response.json();
    const data = result.data;
    return data;
}

async function query_chain(network) {
    var chainId = undefined
    var validation = true
    const block_id = {'eth':'1', 'polygon':'137'}
    if (network === 'eth') {
        chainId = block_id['eth'] 
    } else if (network === 'polygon') {
        chainId = block_id['polygon']
    } else {
        console.log('Invalid Network')
        validation = false
    }
    if (validation === true) {
        const baseURL = 'https://api.covalenthq.com/v1/'
    
        const given_contract = prompt('Contract Address to Query: ')    
        const contract_verify = web3.utils.isAddress(given_contract)
        if (contract_verify === true) {
            const api_key = process.env.API_KEY
            console.log(api_key)
            console.log('fetching...')
            const array = await fetch_data(chainId, given_contract, api_key, baseURL)
            return array
        } else {
            return false
        }
    } else {}

}

async function filter_accounts () {
    var network = prompt('Network of Contract: ')
    const transactions = await query_chain(network)
    if (transactions !== false) {
        let addresses_from_query = []
        let transaction_metadata = transactions['items']
        console.log(transaction_metadata.length)
        let transaction_idx = 0 
        for (transaction_idx; transaction_idx <= transaction_metadata.length; transaction_idx++) {
            let transaction = transaction_metadata[transaction_idx]
            if (transaction !== undefined) {
                const address_filter = transaction['address']
                let contract_check = web3.utils.isAddress(address_filter)
                if (contract_check === true) {
                    console.log(`${address_filter} passed`)
                    addresses_from_query.push(address_filter)
        
                } else {
                    console.log(`${address_filter} was not passed`)
                }
            }
    
        }
    
        return addresses_from_query
    } else {
        console.log('There was an error processing due to invalid contract address')
    }

}


async function test() {
    var resulting = await filter_accounts()
    console.log(resulting)
}

test()