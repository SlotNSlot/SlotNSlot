import Web3 from 'web3';
import EnvChecker from './envChecker';
const mockManagerABI = require('./__mocks__/mockABI.json');
const mockStorageABI = require('./__mocks__/mockStorageABI.json');

const CONTRACT_ADDRESS = '0x942b0ffdeb9a91345804bb6c03ac4fa8fee9143a';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.slotManagerContract = null;
    this.slotStorageContract = null;
    this.storageAddr = null;

    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      const SlotManagerContract = this.web3.eth.contract(mockManagerABI);
      this.slotManagerContract = SlotManagerContract.at(CONTRACT_ADDRESS);
    } else {
      console.warn(
        "No web3 detected. Falling back to https://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      if (EnvChecker.isDev()) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const SlotManagerContract = this.web3.eth.contract(mockManagerABI);
        this.slotManagerContract = SlotManagerContract.at(CONTRACT_ADDRESS);
      }
    }
  }

  getEthFromWei(weiValue) {
    return this.web3.fromWei(weiValue, 'ether').valueOf();
  }

  async initializeStorageContract() {
    if (this.slotManagerContract) {
      await new Promise((resolve, reject) => {
        this.slotManagerContract.getStorageAddr((err, storageAddr) => {
          if (err) {
            reject(err);
          } else {
            this.storageAddr = storageAddr;
            resolve(storageAddr);
          }
        });
      });
      const SlotStorageContract = this.web3.eth.contract(mockStorageABI);
      this.slotStorageContract = SlotStorageContract.at(this.storageAddr);
    }
  }

  getWeb3() {
    return this.web3;
  }

  getNumOfSlotMachine(account) {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.getNumofSlotMachine(account, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getTheNumberOfProviders() {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.getNumofProvider((err, TheNumOfProvider) => {
        if (err) {
          reject(err);
        } else {
          resolve(TheNumOfProvider);
        }
      });
    });
  }

  async getSlotMachineAddressesFromProvider(account) {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.getSlotMachines(account, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }

  async createSlotMachine(account) {
    return await new Promise((resolve, reject) => {
      this.slotManagerContract.createSlotMachine(
        1,
        10,
        100,
        {
          gas: 1000000,
          from: account,
        },
        (err, _transactionAddress) => {
          if (err) {
            reject(err);
          } else {
            const event = this.slotManagerContract.slotMachineCreated();
            event.watch((error, result) => {
              if (error) {
                reject(error);
              } else {
                event.stopWatching();
                resolve(result);
              }
            });
          }
        },
      );
    });
  }
}

const web3Service = new Web3Service();

export default web3Service;
