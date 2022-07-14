# radio3 (npm Version)

A programming package to include decentralized large communication protocols. ***radio3*** allows event hosts to send announcements/SOS calls 
to their participants with ease. 

Powered by an elementary ***Proof-of-Account***, ***radio3*** verifies participants given an event ensuring security and easy event monitoring.

### Installation and use

***Prerequisite:***

If you haven't already, install the [Squarespace Local Development Server](http://developers.squarespace.com/local-development). Then...

Initialize npm directory:

```
npm init 

```

Install npm package:

```
npm install radio3
```

Global Installation npm pacakge:

```
npm install -g radio3
```

### Dependencies

***radio3*** runs on three libraries at the moment: `node-fetch`, `@epnsproject/backend-sdk-staging`, `dotenv`, `web3`. 

Currently, `node-fetch` is running on version *2.6.6* despite having recently published a new version *@3.7.8*. This is due to the new version not being a module, and thus, not being compatiable for ES6. 

The `@epnsproject/backend-sdk-staging` is currently an EPNS library for staging. This is currently used for beta purposes as it is compatible with the Ethereum Test Network *Kovan*. However, in the future *radio3* will be switching to the production library that will require users to need use mainnet `eth`, (***a seperate library will be published for product cases***). Though, the current version of `radio3` works perfectly for large events whether they have their NFT or EPNS Channel on mainnet or a test network.


### radio3 reference

***radio3*** has asynchronous nature. All basic commands require asynchronous function overlap to view result.

#### Import radio3 package

Import radio3 package as a ES6 Module as:
```
var variable_name = require('radio3')
```
Alternative Import Method:
```
import radio3 from 'radio3'
```

#### radio3 Initialization

Initializes event and connects to user's EPNS Channel. This requires users's *private key*. 
*Note*: ***radio3*** does not save or share private keys to anyone or anything. We understand that private keys are confidential and should not be shared with anyone.

```
var variable_name = await radio3.radio3_init(PRIVATE_KEY)
```

To see if a user has successfully connected, try `console.log()` the initialization. If an EPNS object comes out with details about the channel, the user has successfully connected.

#### Connect Event NFT

To send an announcement/sos call to all NFT holders of a specific NFT, a NFT initialization is needed. ***radio3*** allows for such initialization to allow Covalent API to query the chain for the NFT metadata. 

```
var variable_name = await radio3.connect_nft(contract_address, network)
```
***Note***: The `network` parameter can be either two values: `eth` or `poly`. Failing to type such parameters will result in an Error (View ***Errors*** for more information). As a result, the NFTs can only be from the ***Ethereum*** or ***Polygon*** network.

To ensure that a user has successfully connected their nft, `connect_nft()` does return a list of accounts that hold the given nft. However, if the nft can only be held by ***one*** wallet, past wallets that have held the nft will be part of the array as well. 

#### Send Announcement/SOS to Subscribers

Sends an Announcement or SOS to wallets that have subscribed to the EPNS channel made by the event host's private key. Users can view ***Resources*** to learn more about how EPNS Channels work. Currently, since ***radio3*** is running on the staging dependency of EPNS-backend, only channels that are running on the ***staging*** platform (view ***Resources*** for the EPNS Staging Platform) of EPNS will get messages. Though, as mentioned above, there will be a separate library for production channels.

```
const variable_name = await radio3.sendm_sub(message_title, message_content, redirect_link)
```

`sendm_sub()` returns either `true` or `false` depending on if all the messages were sent. If successfully sent, the function will return `true`, else `false` otherwise. 


***Note***: `message_title` must be *larger* than 1 character and *shorter* than 40 characters. `message_content` must be *larger* than 1 character and *shorter* than 115 characters. 

In terms of what users will see on their EPNS wallets, they will see a notification title and notification message first before opening the actual message to see the `message_content` and `message_title`. For ease, radio3 uses the same `message_content` for the **content of notifications** and uses *half* of `message_title` as the **notification title**. 

The `redirect_link` parameter is optional. If an event has a link to send to their participants, wallets can click on that message to be redirected to link. If such a parameter is not needed, keep `redirect_link = null`. 

#### Send Announcement/SOS to Event NFT Holders

Sends an Announcement or SOS to wallets that have a given NFT. However, if the NFT can only be owned by one wallet, the announcement/sos will be sent to all past wallets as well. 

When a user runs the function, the ***proof-of-account*** verification protocol will run where it will output a list of accounts that are ***not*** connected to the event host's EPNS Channel. However, this will just be a warning message, and thus, the content will send, however, will be ended up in their ***spam*** inbox (View ***Resources*** to learn more about EPNS). 

```
const variable_name = await radio3.sendm_nft(message_title, message_content, redirect_link, network)
```

`sendm_nft()` returns either `true` or `false` depending on if all the messages were sent. If successfully sent, the function will return `true`, else `false` otherwise. 


***Note***: `message_title` must be *larger* than 1 character and *shorter* than 40 characters. `message_content` must be *larger* than 1 character and *shorter* than 115 characters. 

In terms of what users will see on their EPNS wallets, they will see a notification title and notification message first before opening the actual message to see the `message_content` and `message_title`. For ease, radio3 uses the same `message_content` for the **content of notifications** and uses *half* of `message_title` as the **notification title**. 

The `redirect_link` parameter is optional. If an event has a link to send to their participants, wallets can click on that message to be redirected to link. If such a parameter is not needed, keep `redirect_link = null`. 

The `network` parameter takes only two parameters: `eth` or `poly`. The parameter inputted should be parallel to which network the NFT is on.

### Errors



## Copyright and License

Copyright 2016 Squarespace, INC.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.