import fetch from "node-fetch"
import promptSync from 'prompt-sync';
const prompt = promptSync();
import Web3 from 'web3'
const web3 = new Web3(Web3.givenProvider || 'https://eth-goerli.gateway.pokt.network/v1/lb/62b7830e123e6f003984c794')
import 'dotenv/config'


class Radio {
    constructor(private_key) {
        this._epnssdk = new EpnsSDK(private_key)

    }

    get sdk () {
        return this._epnssdk
    }
}