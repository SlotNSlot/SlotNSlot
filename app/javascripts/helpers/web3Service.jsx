import Web3 from 'web3';
import Store from 'store';
import updatePlugin from 'store/plugins/update';
import EnvChecker from './envChecker';
import { USER_TYPES } from '../components/slotList/actions';

const managerABI = require('./managerABI.json');
const storageABI = require('./storageABI.json');
const slotMachineABI = require('./slotMachineABI.json');

const SLOT_MANAGER_ADDRESS = '0x06d19f3e324a35815be62492c6cd459d495f96fe';
Store.addPlugin(updatePlugin);

class Web3Service {
  constructor() {
    this.web3 = null;
    this.slotManagerContract = null;
    this.slotStorageContract = null;
    this.storageAddr = null;
    this.myOccupiedGameInitWatchers = {};

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

  makeS3Sha(recursiveLength, genesisRandomNumber) {
    const originalString = genesisRandomNumber ? genesisRandomNumber : Math.random().toString();
    let shaValue;

    for (let i = 0; i < recursiveLength; i++) {
      if (shaValue) {
        shaValue = this.web3.sha3(shaValue, { encoding: 'hex' });
      } else {
        shaValue = this.web3.sha3(originalString, { encoding: 'hex' });
      }
    }

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

  async sendEtherToAccount({ from, to, etherValue }) {
    return new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction(
        {
          from,
          to,
          value: this.makeWeiFromEther(parseFloat(etherValue, 10)),
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
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

  makeWeiFromEther(etherValue) {
    if (typeof etherValue !== 'number') {
      throw new Error('You should insert ether value with number type');
    }
    return parseInt(this.web3.toWei(etherValue, 'ether'), 10);
  }

  makeEthFromWei(weiValue) {
    return parseFloat(this.web3.fromWei(weiValue, 'ether').valueOf(), 10);
  }

  async createSlotMachine({ account, decider, minBet, maxBet, maxPrize }) {
    return await new Promise((resolve, reject) => {
      this.slotManagerContract.createSlotMachine(
        decider,
        this.makeWeiFromEther(parseFloat(minBet, 10)),
        this.makeWeiFromEther(parseFloat(maxBet, 10)),
        maxPrize,
        {
          gas: 2200000,
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

  async leaveSlotMachine(slotMachineContract, playerAddress) {
    return new Promise((resolve, reject) => {
      slotMachineContract.leave({ from: playerAddress, gas: 1000000 }, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getSlotMachineInfo(slotMachineContract, userType, myAddress) {
    // 0 [player], 1 [maker]
    const promiseArr = [
      this.getSlotMachinePlayer(slotMachineContract, userType),
      this.getSlotMachineOwner(slotMachineContract, userType, myAddress),
      this.getSlotMachineAvailable(slotMachineContract, userType),
      this.getSlotMachineBankrupt(slotMachineContract, userType),
      this.getSlotMachineMaxBet(slotMachineContract),
      this.getSlotMachineMinBet(slotMachineContract),
      this.getSlotMachineProviderBalance(slotMachineContract),
      this.getSlotMachineMaxPrize(slotMachineContract),
      this.getPlayerBalance(slotMachineContract),
    ];
    const payload = { address: slotMachineContract.address };
    await Promise.all(promiseArr).then(infoObjArr => {
      infoObjArr.forEach(infoObj => {
        payload[infoObj.infoKey] = infoObj.infoVal;
      });
    });
    return payload;
  }

  getSlotMachineOwner(slotMachineContract, userType, myAddress) {
    return new Promise((resolve, reject) => {
      slotMachineContract.owner((err, ownerAddress) => {
        if (err) {
          reject(err);
        } else {
          if (userType === USER_TYPES.PLAYER && ownerAddress === myAddress) {
            reject();
          }
          resolve({ infoKey: 'owner', infoVal: ownerAddress });
        }
      });
    });
  }

  getPlayerBalance(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.playerBalance((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve({ infoKey: 'deposit', infoVal: result });
        }
      });
    });
  }

  getSlotMachinePlayer(slotMachineContract, userType) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mPlayer((err, mPlayer) => {
        if (err) {
          reject(err);
        } else {
          if (userType === USER_TYPES.PLAYER && mPlayer !== '0x0000000000000000000000000000000000000000') {
            reject('This slot is already occupied!');
          }
          resolve({ infoKey: 'mPlayer', infoVal: mPlayer });
        }
      });
    });
  }

  getSlotMachineAvailable(slotMachineContract, userType) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mAvailable((err, mAvailable) => {
        if (err) {
          reject(err);
        } else {
          if (userType === USER_TYPES.PLAYER && !mAvailable) reject('This slot is not available!');
          resolve({ infoKey: 'available', infoVal: mAvailable });
        }
      });
    });
  }

  getSlotMachineBankrupt(slotMachineContract, userType) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mBankrupt((err, mBankrupt) => {
        if (err) {
          reject(err);
        } else {
          if (userType === USER_TYPES.PLAYER && mBankrupt) reject('This slot is bankrupted!');
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
            infoVal: this.makeEthFromWei(parseInt(mMaxBet.valueOf(), 10)),
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
            infoVal: this.makeEthFromWei(parseInt(mMinBet.valueOf(), 10)),
          });
        }
      });
    });
  }

  getSlotMachineMaxPrize(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mMaxPrize((err, mMaxPrize) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            infoKey: 'maxPrize',
            infoVal: mMaxPrize,
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
            infoVal: providerBalance,
          });
        }
      });
    });
  }
  createGenesisRandomNumber(slotAddress) {
    if (Store.get(slotAddress) !== undefined) {
      console.log('already slotGenesisRandomNumber exist ', Store.get(slotAddress));
    } else {
      const sha = this.makeS3Sha(10000);
      const slotGenesisInfo = {
        index: 10000,
        val: sha,
        isOccuWatched: false,
        isInitWatched: false,
      };
      Store.set(slotAddress, slotGenesisInfo);
      console.log('first slotGenesisRandomNumber ', Store.get(slotAddress));
    }
  }
  occupySlotMachine(slotMachineContract, playerAddress, weiValue) {
    return new Promise((resolve, reject) => {
      let sha;
      Store.update(slotMachineContract.address, slotGenesisInfo => {
        sha = this.makeS3Sha(slotGenesisInfo.index, slotGenesisInfo.val);
        slotGenesisInfo.index -= 1;
      });
      console.log('Store is ', Store.get(slotMachineContract.address));
      console.log('sha is ', sha);
      slotMachineContract.occupy(sha, { from: playerAddress, value: weiValue, gas: 2200000 }, err => {
        if (err) {
          reject(err);
        } else {
          const event = slotMachineContract.providerSeedInitialized();
          event.watch((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  }

  playSlotMachine(playInfo) {
    return new Promise((resolve, reject) => {
      const slotMachineContract = playInfo.slotMachineContract;
      console.log('play!', playInfo);
      console.log('betSize info is ', this.makeWeiFromEther(parseFloat(playInfo.betSize, 10)));
      slotMachineContract.initGameforPlayer(
        this.makeWeiFromEther(parseFloat(playInfo.betSize, 10)),
        playInfo.lineNum,
        {
          from: playInfo.playerAddress,
          gas: 1592450,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log('initGameforPlayer Over.', result);
            const event = slotMachineContract.providerSeedSet();
            console.log('providerSeedSet watching start', event);
            event.watch((error, result2) => {
              if (error) {
                event.stopWatching();
                reject(error);
              } else {
                console.log('providerSeedSet over!', event);
                let sha;
                Store.update(slotMachineContract.address, slotGenesisInfo => {
                  sha = this.makeS3Sha(slotGenesisInfo.index, slotGenesisInfo.val);
                  slotGenesisInfo.index -= 1;
                });
                console.log('Store is ', Store.get(slotMachineContract.address));
                console.log('sha is ', sha);
                console.log('event is ', event);
                event.stopWatching();
                slotMachineContract.setPlayerSeed(
                  sha,
                  {
                    from: playInfo.playerAddress,
                    gas: 1000000,
                  },
                  async (err2, result3) => {
                    console.log('playerSeed!', result3);
                    if (err2) {
                      reject(err2);
                    } else {
                      resolve(result2);
                    }
                  },
                );
              }
            });
          }
        },
      );
    });
  }

  async getSlotResult(slotMachineContract) {
    return await new Promise((resolve, reject) => {
      const event = slotMachineContract.gameConfirmed();
      console.log('start to get slot result', event);
      Store.update(slotMachineContract.address, slotGenesisInfo => {
        slotGenesisInfo.isOccuWatched = false;
        slotGenesisInfo.isInitWatched = false;
      });
      event.watch((error, result) => {
        if (error) {
          reject(error);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    });
  }

  getSlotMachineCurrentGameId(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mCurrentGameId((err, mCurrentGameId) => {
        if (err) {
          reject(err);
        } else {
          resolve(mCurrentGameId);
        }
      });
    });
  }

  getSlotMachineGame(slotMachineContract, gameId) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mGames(gameId, (err, mGame) => {
        if (err) {
          reject(err);
        } else {
          resolve(mGame);
        }
      });
    });
  }

  async watchGameOccupied(slotMachineContract, providerAddress) {
    return await new Promise((resolve, reject) => {
      const slotMachineContractAddress = slotMachineContract.address;
      if (this.myOccupiedGameInitWatchers[slotMachineContractAddress]) {
        return;
      }

      const event = slotMachineContract.gameOccupied();
      console.log('gameOccupied watching!', event);
      // To check the game watcher already exist or not
      this.myOccupiedGameInitWatchers[slotMachineContractAddress] = true;

      event.watch((error, result) => {
        if (error) {
          reject(error);
        } else {
          const isOccuWatched = Store.get(slotMachineContractAddress).isOccuWatched;
          if (isOccuWatched === false) {
            console.log('gameOccupied over!', result);
            let sha;
            Store.update(slotMachineContract.address, slotGenesisInfo => {
              sha = this.makeS3Sha(slotGenesisInfo.index, slotGenesisInfo.val);
              slotGenesisInfo.index -= 1;
              slotGenesisInfo.isOccuWatched = true;
            });
            console.log('Store is ', Store.get(slotMachineContract.address));
            console.log('sha is ', sha);
            slotMachineContract.initProviderSeed(sha, { from: providerAddress, gas: 2200000 }, (err, result2) => {
              if (err) {
                reject(err);
              } else {
                console.log('initProviderSeed!', result2);
                resolve(result);
              }
            });
          }
        }
      });
    });
  }

  async watchGameInitialized(slotMachineContract, providerAddress) {
    return await new Promise((resolve, reject) => {
      const event = slotMachineContract.gameInitialized();
      console.log('watching GameInitialized', event);
      event.watch((error, result) => {
        if (error) {
          reject(error);
        } else {
          event.stopWatching();
          const isInitWatched = Store.get(slotMachineContract.address).isInitWatched;
          if (isInitWatched === false) {
            let sha;
            Store.update(slotMachineContract.address, slotGenesisInfo => {
              sha = this.makeS3Sha(slotGenesisInfo.index, slotGenesisInfo.val);
              slotGenesisInfo.index -= 1;
              slotGenesisInfo.isInitWatched = true;
            });
            console.log('Store is ', Store.get(slotMachineContract.address));
            console.log('sha is ', sha);
            console.log('watch over! GameInitialized', result);
            slotMachineContract.setProviderSeed(sha, { from: providerAddress, gas: 1000000 }, (err, result2) => {
              if (err) {
                reject(err);
              } else {
                console.log('setProviderSeed!', result2);
                resolve(result2);
              }
            });
          }
        }
      });
    });
  }
}

const web3Service = new Web3Service();

export default web3Service;
