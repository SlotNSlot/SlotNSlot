# SlotNSlot

## WARNING
**SlotNSlot Beta supports both Geth and Metamask to interact with Ethereum Network.**

**We still recommend you to use Geth, since Metamask works far slower than Geth as it doesn't support neither checking pending transactions nor force-generating transactions without pop-up permissions.**

**For this reason, this instruction only explains how to use Geth for SlotNSlot Beta.**

Metamask has announced their plan to support pending transactions. Use of Metamask on SlotNSlot will be available in the future implementation.

**If your browser has Metamast extension and you want to use Geth client, please use browser's incognito mode or unable/remove Metamask**

## Requirements
- [Chrome browser](https://www.google.co.kr/chrome/browser/)
- Geth client or MetaMask (We strongly recommend that you use Geth)
- Rinkeby(Testnet) Account & Ether balance

## Installation
**If you already have Geth client, just skip this part**

### MacOS
- Install HomeBrew (If you already have HomeBrew, just skip this step)
1. Open Terminal
2. Paste and execute below code

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

- Install Geth client
1. Open Terminal
2. Paste and execute below code

```bash
$ brew tap ethereum/ethereum
$ brew install ethereum
```

### Windows

[GETH official download page](https://geth.ethereum.org/downloads/)
Download the Windows installation package, and execute. Follow the installation process to finish installing Geth on your PC.

After finishing installation, do NOT turn on the Geth client (geth.exe) directly. You need to open it in the command line terminal with some more options.

## Running the Geth Client
**If you know how to run Geth client, create and unlock account, and sync it on Rinkeby, you can skip this part.**

### Sync with the Rinkeby blockchain

1. Open Terminal
 - Run terminal from Spotlight [Command (⌘)-Space bar] if you use Mac
 - Open up the start menu [⊞ Win] or the run dialog box [⊞ Win+R], and run CMD if you use Windows
2. Paste and execute below code

```bash
 $ geth --rinkeby --syncmode=fast --cache=1024 --rpc --rpccorsdomain "*" --rpcapi personal,eth,net,web3 --bootnodes=“enode://6853f434735e540f0fcd85ffebcaa75280d1171ca9a205e8c41d87428d71b07ad14ab266236b64268467ccc462679edc888f76326418d18d7bcfe8d1159391aa@51.15.61.194:30379” console
 ```

Then, Geth client should begin synchronization.
This work takes at least 40 minutes. If your block number reach the recent mined block number, it's done.
You can check the destination block number [here](https://www.rinkeby.io/)

### Create Account
At above command, you turned on Geth client with console.
As the result, you can create your own Ethereum account.

In console, paste and execute below code
```
> personal.newAccount()
```

This command requires `Passphrase`.
If you don't know about this term, just think it like password.

after creating account, you can check your account with below command.

```
> eth.accounts
```

Copy your account address (it's a 40-digits hexadecimal number attached to 0x) and save it somewhere else.

Then execute the command written below to unlock your account.

```
# Paste your account address and passphrase to [account], [pass] part.
> personal.unlockAccount([account], [pass])
```

you're all ready with your Geth console, and all you need is some Ether.

## Get Rinkeby(testnet) Ether
**Skip this part if you already have some Ether on your Rinkeby account or you know how to get some from the faucet.**

- If you don't have Github account, make an account [here](https://github.com/join)
- Click [Github Gist Link](https://gist.github.com/)
- Copy&paste your Rinkeby account address to content. You can leave all other inputs blank.
- Click `Create public gist`
- After making Gist, copy your gist URL address
- Paste your Gist URL address to input field in [Faucet Page](https://faucet.rinkeby.io/)
- Click Give me Ether
- Select options you want

Wait for 30s~1m. Then you can find that you have new Ether at Geth console.

```
# Geth console
# ex) eth.getBalance("0x0dsdakfaksdfjklvckljxczvjkzxcv")

eth.getBalance("[address]")
```

If you find it complicated to get the free Rinkeby Ether yourself, visit [Discord](https://discord.gg/f97RkQf) and ask the team for some. Note that you must provide your account address to get Ether.

## License
Licensed under the GNU GENERAL PUBLIC LICENSE (Version 3, 29th June 2007)

## Contact
The team is open to any debates in any channel for improving the service. If you have any concerns and suggestions about the service, please contact the team with [Github](https://github.com/SlotNSlot/SlotNSlot), [Twitter](https://twitter.com/slotnslot), [Discord](https://discord.gg/f97RkQf), [Telegram](https://t.me/slotnslot_ico), [Facebook](https://www.facebook.com/slotnslot.eth), [Reddit](https://www.reddit.com/r/SlotNSlot/), or any other communication channels.
