import Web3 from 'web3';
import EnvChecker from './envChecker';

const managerABI = require('./managerABI.json');
const storageABI = require('./storageABI.json');
const slotMachineABI = require('./slotMachineABI.json');

const SLOT_MANAGER_ADDRESS = '0xe4b8b1dd66d083017e4a5e761faae9c6f88b90f8';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.slotManagerContract = null;
    this.slotStorageContract = null;
    this.storageAddr = null;

    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      const SlotManagerContract = this.web3.eth.contract(managerABI);
      this.slotManagerContract = SlotManagerContract.at(SLOT_MANAGER_ADDRESS);
    } else {
      console.warn(
        "No web3 detected. Falling back to https://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      if (EnvChecker.isDev()) {
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        const SlotManagerContract = this.web3.eth.contract(managerABI);
        this.slotManagerContract = SlotManagerContract.at(SLOT_MANAGER_ADDRESS);
      }
    }
  }

  getEthFromWei(weiValue) {
    return this.web3.fromWei(weiValue, 'ether').valueOf();
  }

  makeS3Sha(recursiveLength) {
    const oldTime = new Date();
    const originalString = Math.random().toString();
    let shaValue;

    for (let i = 0; i < recursiveLength; i++) {
      if (shaValue) {
        shaValue = this.web3.sha3(shaValue);
      } else {
        shaValue = this.web3.sha3(originalString);
      }
    }
    const afterTime = new Date();

    console.log(shaValue);
    console.log(afterTime - oldTime);

    return shaValue;
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
      const SlotStorageContract = this.web3.eth.contract(storageABI);
      this.slotStorageContract = SlotStorageContract.at(this.storageAddr);
    }
  }

  getSlotMachineContract(contractAddress) {
    const SlotStorageContract = this.web3.eth.contract(slotMachineABI);
    return SlotStorageContract.at(contractAddress);
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

  async getProviderAddress(index) {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.provideraddress(index, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async sendProivderEtherToSlotMachine({ ownerAddress, playerAddress, etherValue }) {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction(
        {
          from: ownerAddress,
          to: playerAddress,
          value: this.web3.toWei(parseFloat(etherValue, 10), 'ether'),
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log(result);
            resolve(result);
          }
        },
      );
    });
  }

  async getSlotMachineAddressFromProvider(account, index) {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.getSlotMachine(account, index, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
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
  async getSlotMachineInfo(slotMachineContract) {
    const promiseArr = [
      this.getSlotMachineAvailable(slotMachineContract),
      this.getSlotMachineBankrupt(slotMachineContract),
      this.getSlotMachineMaxBet(slotMachineContract),
      this.getSlotMachineMinBet(slotMachineContract),
      this.getSlotMachineProviderBalance(slotMachineContract),
    ];
    const payload = {};
    await Promise.all(promiseArr).then(infoObjArr => {
      infoObjArr.forEach(infoObj => {
        payload[infoObj.infoKey] = infoObj.infoVal;
      });
    });
    return payload;
  }

  getSlotMachineAvailable(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mAvailable((err, mAvailable) => {
        if (err) {
          reject(err);
        } else {
          if (!mAvailable) reject('This slot is not avaliable!');
          resolve({ infoKey: 'avaliable', infoVal: mAvailable });
        }
      });
    });
  }

  getSlotMachineBankrupt(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mBankrupt((err, mBankrupt) => {
        if (err) {
          reject(err);
        } else {
          if (mBankrupt) reject('This slot is bankrupted!');
          resolve({ infoKey: 'bankrupt', infoVal: mBankrupt });
        }
      });
    });
  }

  getSlotMachineMaxBet(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mMaxBet((err, mMaxBet) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            infoKey: 'maxBet',
            infoVal: this.getEthFromWei(parseInt(mMaxBet.valueOf(), 10)),
          });
        }
      });
    });
  }

  getSlotMachineMinBet(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mMinBet((err, mMinBet) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            infoKey: 'minBet',
            infoVal: this.getEthFromWei(parseInt(mMinBet.valueOf(), 10)),
          });
        }
      });
    });
  }

  getSlotMachineProviderBalance(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.providerBalance((err, providerBalance) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            infoKey: 'bankRoll',
            infoVal: this.getEthFromWei(parseInt(providerBalance.valueOf(), 10)),
          });
        }
      });
    });
  }

  async playSlotMachine(playInfo) {
    return await new Promise((resolve, reject) => {
      this.slotStorageContract.playSlotMachine(
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
            const event = this.slotStorageContract.slotMachinePlayed();
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
