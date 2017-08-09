# Slot-n-Slot

## WARNING
**If you run SlotNSlot with Metamask, it's way slower than Geth client**

## Requirements
- Geth client or MetaMask (Metamask transaction is extremely slower than Geth)
- Ropsten(Testnet) Account & Ether balance

## Installation
**If you already have Geth client, just skip this part**

#### MacOS
- Install HomeBrew (If you already have HomeBrew, just skip this step)
1. Open Terminal
2. Paste and execute below code

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

- Install Geth client
1. Open Terminal
2. Paste and execute below code

```bash
brew tap ethereum/ethereum
brew install ethereum
```

#### Windows

[Windows GETH Installation Link](https://github.com/ethereum/go-ethereum/wiki/Installation-instructions-for-Windows)


## Before Start
### Geth Client

#### Sync blocks (Geth Client only)

1. Open Terminal
2. Paste and execute below code

```bash
geth --testnet --syncmode=fast --rpc --shh --networkid=3 console
```

Then, it starts syncing job.
This work takes at least 40 minutes. If your block number reach the recent mined block number, it's done.
You can check the destination block number [here](https://ropsten.etherscan.io/)

#### Create Account
At above command, you turned on Geth client with console.
As the result, you can create your own Ethereum account.

In console, paste and execute below code
```
personal.newAccount()
```

This command requires `Passphrase`.
If you don't know about this term, just think it like password.

after creating account, you can check your account with below command.

```
eth.accounts
```

Copy your account address and save it somewhere else.

Then restart your Geth client with --unlock option to unlock your account.

```
# Geth console
> exit
```

```bash
# Paste your account address to [account] part
# Ex) geth --testnet --syncmode=full --rpc --shh --networkid=3 --unlock 0xceeb8b025e23deef03a9ead0ecb4a4be98282006 console
geth --testnet --syncmode=full --rpc --shh --networkid=3 --unlock [account] console
```

After executing command, you should insert your passphrase to unlock account.
When Geth client ask you passphrase, just type it.

```
# Geth console
# It's normal nothing happens on your screen even you type key
# Don't worry it's working

passphrase:
```

If you can see `Welcome to the Geth JavaScript console!` message,
You are ready to play SlotNSlot!

### MetaMask
# Select Rinkeby or Ropsten Network (MetaMask Only)
- Click Metamask Icon on the browser menu bar
- Click Ethereum Main Net on top left corner
- Select Ropsten Test Network

Create an account or unlock your account. then You are ready to play SlotNSlot!

## Get Ropsten(testnet) Ethereum

The easiest way to get test Ethereum is using Metamask.

- Click the Metamask icon on the browser menu bar
- Click BUY
- Click ROPSTEN TEST FAUCET
- Click request 1 ether from faucet

Wait for 30s~1m. Then You can find that you have new Ether at Metamask account.

If you want to send this Ether to Geth client's account follow below steps.

- Click the Metamask icon on the browser menu bar
- Insert your Geth account to Recipient Address input field
- Set Ether amount to send your account. You must set this value little lower than current balance, because a transaction will spend GAS Price
- Click Send button

Wait for 30s~1m. You'll get Ether from Metamask account.

## License
Licensed under the GNU GENERAL PUBLIC LICENSE (Version 3, 29th June 2007)

## Contact
The team is open to any debates in any channel for improving the service. If you have any concerns and suggestions about the service, please contact the team with [Github](https://github.com/SlotNSlot/SlotNSlot), [Twitter](https://twitter.com/slotnslot), [Hipchat](https://discord.gg/f97RkQf) or any other communication channels.
