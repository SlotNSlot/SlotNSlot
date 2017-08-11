# Slot-n-Slot

## WARNING
**If you run SlotNSlot with Metamask, it's way slower than Geth client**

**If you Metamask on your browser, SlotNSlot always try to connect to the Metamask first even if you are turning on Geth Client**

Because Metamask is way slower than Geth client, we expect most of the users want to use Geth.

**If you want to use Geth client, please use browser's incognito mode or remove Metamask**

## Requirements
- Geth client or MetaMask (Metamask transaction is extremely slower than Geth)
- Rinkeby(Testnet) Account & Ether balance

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
 geth --networkid=4 --datadir=$HOME/.rinkeby --syncmode=fast --ethstats=geth --cache=512 --ethstats='pepsi:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://fda3f6273a0f2da4ac5858d1f52e5afaf9def281121be3d37558c67d4d9ca26c6ad7a0520b2cd7454120fb770e86d5760487c9924b2166e65485f606e56d60fc@51.15.69.144:30303 --rpcapi personal,db,eth,net,web3 --rpc --rpccorsdomain "*"
 ```

Then, it starts syncing job.
This work takes at least 40 minutes. If your block number reach the recent mined block number, it's done.
You can check the destination block number [here](https://www.rinkeby.io/)

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
# Insert 0 to [account] means 1st account

# Ex) geth --networkid=4 --datadir=$HOME/.rinkeby --syncmode=fast --ethstats=geth --cache=512 --ethstats='pepsi:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://fda3f6273a0f2da4ac5858d1f52e5afaf9def281121be3d37558c67d4d9ca26c6ad7a0520b2cd7454120fb770e86d5760487c9924b2166e65485f606e56d60fc@51.15.69.144:30303 --rpcapi personal,db,eth,net,web3 --rpc --rpccorsdomain "*" --unlock 0 console

geth --networkid=4 --datadir=$HOME/.rinkeby --syncmode=fast --ethstats=geth --cache=512 --ethstats='pepsi:Respect my authoritah!@stats.rinkeby.io' --bootnodes=enode://fda3f6273a0f2da4ac5858d1f52e5afaf9def281121be3d37558c67d4d9ca26c6ad7a0520b2cd7454120fb770e86d5760487c9924b2166e65485f606e56d60fc@51.15.69.144:30303 --rpcapi personal,db,eth,net,web3 --rpc --rpccorsdomain "*" --unlock 0 console
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
# Select Rinkeby (MetaMask Only)
- Click Metamask Icon on the browser menu bar
- Click Ethereum Main Net on top left corner
- Select Rinkeby Test Network

Create an account or unlock your account. then You are ready to play SlotNSlot!

## Get Rinkeby(testnet) Ethereum

Before start, if you don't have Github Gist account, make an account at [here](https://github.com/join)

- Visit [https://www.rinkeby.io/](https://www.rinkeby.io/)
- Click Crypto Faucet
- Click [Github Gist Link](https://gist.github.com/)
- Write down your account address to content. You can leave blank at Gist description and Filename input
- Click `Create public gist`
- After making Gist, copy your gist URL address
- Paste your Gist URL address to `Rinkeby GitHub Authenticated Faucet` input field
- Click Give me Ether
- Select options you want

Wait for 30s~1m. Then You can find that you have new Ether at Geth console.

```
# Geth console
# ex) eth.getBalance("0x0dsdakfaksdfjklvckljxczvjkzxcv")

eth.getBalance("[address]")
```

## License
Licensed under the GNU GENERAL PUBLIC LICENSE (Version 3, 29th June 2007)

## Contact
The team is open to any debates in any channel for improving the service. If you have any concerns and suggestions about the service, please contact the team with [Github](https://github.com/SlotNSlot/SlotNSlot), [Twitter](https://twitter.com/slotnslot), [Hipchat](https://discord.gg/f97RkQf) or any other communication channels.
