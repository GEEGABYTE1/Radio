const EpnsSDK = require("@epnsproject/backend-sdk-staging").default
const ethers = require('ethers')
require('dotenv').config()
const prompt = require('prompt-sync')()
const Web3 = require('web3')         
const web3 = new Web3(Web3.givenProvider || 'https://eth-goerli.gateway.pokt.network/v1/lb/62b7830e123e6f003984c794') 


class Run {
    constructor() {
        this._epnssdk = new EpnsSDK(process.env.PRIVATE_KEY)
    }

    get sdk() {
        return this._epnssdk
    }

    check_contract(contract) {
        const contract_status = web3.utils.isAddress(contract)
        return contract_status
    }

    async running() {
        var user_prompt = prompt('Event NFT Address: ')
        const nft_status = this.check_contract(user_prompt)
        if (nft_status === false) {
            console.log('NFT is not valid')
        } else {
            while (true) {
                user_prompt = prompt(': ')
                if (user_prompt === 'announcement' || user_prompt === 'sos') {
                    var message_title = prompt('Message Title: ')
                    const message_title_result = this.message_title_verification(message_title)
                    const message_title_bool = message_title_result[0]
                    const message_title_length = message_title_result[1]
                    if (message_title_bool === false) {
                        console.log(`${message_title} is not within character limit - ${message_title_length}`)
                    } else {


                        var message_content = prompt('Message Content: ')
                        const message_content_verification = this.message_content_verification(message_content)
                        const message_content_bool = message_content_verification[0]
                        const message_content_length = message_content_verification[1]
                        if (message_content_bool === false) {
                            console.log(`${message_content} is not within character limit - ${message_content_length}`)
                        } else {
                            var message_string_lst = message_title.split('')
                            var notification_title = this.notification_title_creation(message_string_lst)
                            var notification_content = message_content
                            var redirect_link = prompt('Redirect Link: ')
                            const subscribers = await this.fetch_subscribers()
                            console.log(subscribers)
                            if (subscribers.length === 0) {
                                console.log('There are no users in Channel')
                            } else {
                                let subscriber_idx = 0
                                for (subscriber_idx; subscriber_idx <= subscribers.length; subscriber_idx++) {
                                    
                                    const account = subscribers[subscriber_idx]
                                    console.log(`Sending Message to: ${account}`)
                                    const message_status = await this.send_message(account, message_title, message_content, notification_title, notification_content, redirect_link)
                                    if (message_status === true) {
                                        console.log('Announcement Sent Successfully')
                                    } else {
                                        console.log('Announcement not sent successfully')
                                    }
                                }
                            }

                        }

                    }

  
                } else if (user_prompt === 'subscribers') {
                    const subscribers = this.fetch_subscribers()
                    const subscriber_idx = 0 
                    console.log('----------------------------------')
                    for (subscriber_idx; subscriber_idx <= subscribers.length; subscriber_idx++) {
                        const account = subscribers[subscriber_idx]
                        console.log(`: ${account}`)
                    }
                    console.log('----------------------------------')
                }
            }

        }
        
    }

    message_title_verification (message_title) {
        const message_title_split = message_title.split('')
        if (message_title_split.length > 20 || message_title_split < 1) {
            return [false, message_title_split.length]
        } else {
            return true
        }
    }

    message_content_verification (message_content) {
        const message_content_split = message_content.split('')
        if (message_content_split.length < 1 || message_content_split.length > 85) {
            return [false, message_content_split.length]
        } else {
            return true
        }
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

    async send_message(account, message_title, message_content, notification_title, notification_content, redirect_link) {
        const date_lst = this.time()
        const date_string = date_lst[0]
        const time_string = date_lst[1]
        const resulting_string = `${date_string} \n ${time_string}`
        message_content += '\n'
        message_content += resulting_string
        try {
            const reponse = await this._epnssdk.sendNotification(
                account, 
                message_title,
                message_content,
                notification_title,
                notification_content,
                1,
                redirect_link
            )
            return true
        } catch (err) {
            return false
        }

        

    }

    async fetch_subscribers() {
        const allSubscribers = await this._epnssdk.getSubscribedUsers()
        return allSubscribers  
    }

    
    notification_title_creation(string_lst) {
        var resulting_string = ''
        const half_length = string_lst.length / 2
        const string_split = string_lst.slice(0, half_length)
        let idx = 0 
        for (idx; idx <= string_split.length; idx++) {
            let letter = string_split[idx]
            resulting_string += letter
        }

        return resulting_string

    }
    
}

exports.radio = new Run()
