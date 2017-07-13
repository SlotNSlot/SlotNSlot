import Web3 from 'web3';
import EnvChecker from './envChecker';
const mockABI = require('./__mocks__/mockABI.json');

const CONTRACT_ADDRESS = '0x6225df7d671e0278b5bc32144fe88f5139edba0a';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.slotContract = null;

    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      const SlotContract = this.web3.eth.contract(mockABI);
      this.slotContract = SlotContract.at(CONTRACT_ADDRESS);
    } else {
      console.warn(
        "No web3 detected. Falling back to https://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      if (EnvChecker.isDev()) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

        const SlotContract = this.web3.eth.contract(mockABI);
        this.slotContract = SlotContract.at(CONTRACT_ADDRESS);
      }
    }
  }

  getEthFromWei(weiValue) {
    return this.web3.fromWei(weiValue, 'ether').valueOf();
  }

  getWeb3() {
    return this.web3;
  }

  getNumOfSlotMachine() {
    return this.slotContract.getNumofSlotMachine().valueOf();
  }

  async createSlotMachine(account) {
    return await new Promise((resolve, reject) => {
      this.slotContract.createSlotMachine(
        1,
        10,
        100,
        {
          gas: 1000000,
          from: account,
        },
        (err, transactionAddress) => {
          if (err) {
            reject(err);
          } else {
            const interval = window.setInterval(() => {
              this.web3.eth.getTransaction(transactionAddress, (error, result) => {
                if (error) {
                  reject(error);
                  console.log('getTransaction', error);
                } else {
                  if (result.blockNumber) {
                    window.clearInterval(interval);
                    result.tx = transactionAddress;
                    resolve(result);
                  } else {
                    console.log('*');
                  }
                }
              });
            }, 500);
          }
        },
      );
    });
  }
}

const web3Service = new Web3Service();
export default web3Service;
