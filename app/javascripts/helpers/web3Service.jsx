import Web3 from 'web3';
import Store from 'store';
import updatePlugin from 'store/plugins/update';
import EnvChecker from './envChecker';
import { USER_TYPES } from '../components/slotList/actions';
import Toast from './notieHelper';

const managerABI = require('./managerABI.json');
const storageABI = require('./storageABI.json');
const slotMachineABI = require('./slotMachineABI.json');

const SHA_CHAIN_NUM = 3;
const ROUND_PER_CHAIN = 3333;
const TOTAL_ROUND = ROUND_PER_CHAIN * SHA_CHAIN_NUM + 1;

const SLOT_MANAGER_ADDRESS = '0x8e560f068c951a7642639e1af7af10ee036cc6eb';
const SLOT_TOPICS_ENCODED = {
  gameOccupied: '0xa8594317be29e78728fb10fbf57b1f8becff7bc83fa4639b9c3b0a4c965f9629',
  bankerSeedInitialized: '0xa4338f9ae2970a5aa65035a4c9fb88da1cd0940e3df6fd42874bb3d862806972',
  gameInitialized: '0xb7f32217976898f350090cced7da439b6a1de2d176c3895f4cf388c6a9388190',
  bankerSeedSet: '0x05157405ea453181cba290132a142d488a688a03f0b08869ca47c88a0cbba8b5',
  playerSeedSet: '0xee65ec46c8744067af9955308ee9958ab02a5882e505b3b06e3e4e50cada6014',
  gameConfirmed: '0x1368b5893c84709f55237ada3ba22400bf115786939fd504096b5c8ad20d5d63',
};

Store.addPlugin(updatePlugin);

class Web3Service {
  constructor() {
    this.web3 = null;
    this.slotManagerContract = null;
    this.slotStorageContract = null;
    this.storageAddr = null;
    this.myInitializedGameInitWatchers = {};

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

  makeS3Sha(recursiveLength, genesisRandomNumber = Math.random().toString()) {
    const originalString = genesisRandomNumber;

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
      this.slotStorageContract.getNumOfSlotMachine(account, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getTheNumberOfBankers() {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.getNumOfBanker((err, TheNumOfBanker) => {
        if (err) {
          reject(err);
        } else {
          resolve(TheNumOfBanker);
        }
      });
    });
  }

  async getBankerAddress(index) {
    return new Promise((resolve, reject) => {
      this.slotStorageContract.bankerAddress(index, (err, result) => {
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

  async getSlotMachineAddressFromBanker(account, index) {
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
    return this.web3.toBigNumber(this.web3.fromWei(weiValue, 'ether').valueOf());
  }

  async createSlotMachine({ account, decider, minBet, maxBet, maxPrize, slotName }) {
    return await new Promise((resolve, reject) => {
      this.slotManagerContract.createSlotMachine(
        decider,
        this.makeWeiFromEther(parseFloat(minBet, 10)),
        this.makeWeiFromEther(parseFloat(maxBet, 10)),
        maxPrize,
        slotName,
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
      this.getSlotMachineBankerBalance(slotMachineContract),
      this.getSlotMachineMaxPrize(slotMachineContract),
      this.getPlayerBalance(slotMachineContract),
      this.getSlotName(slotMachineContract),
      this.getDecider(slotMachineContract),
    ];
    const payload = { address: slotMachineContract.address };
    await Promise.all(promiseArr).then(infoObjArr => {
      infoObjArr.forEach(infoObj => {
        payload[infoObj.infoKey] = infoObj.infoVal;
      });
    });
    return payload;
  }
  getDecider(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mDecider((err, decider) => {
        if (err) {
          reject(err);
        } else {
          resolve({ infoKey: 'decider', infoVal: decider });
        }
      });
    });
  }
  getSlotName(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.mName((err, slotName) => {
        if (err) {
          reject(err);
        } else {
          const paddingIndex = slotName.substring(1).indexOf('0');
          const partSlotName = slotName.substring(0, paddingIndex + 1);
          const asciiSlotName = this.web3.toAscii(partSlotName);
          resolve({ infoKey: 'slotName', infoVal: asciiSlotName });
        }
      });
    });
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
          resolve({ infoKey: 'deposit', infoVal: this.makeEthFromWei(result) });
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
            infoVal: this.makeEthFromWei(mMaxBet),
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
            infoVal: this.makeEthFromWei(mMinBet),
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

  getSlotMachineBankerBalance(slotMachineContract) {
    return new Promise((resolve, reject) => {
      slotMachineContract.bankerBalance((err, bankerBalance) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            infoKey: 'bankRoll',
            infoVal: this.makeEthFromWei(bankerBalance),
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
        round: TOTAL_ROUND,
        val: [],
        isOccuWatched: false,
        isInitWatched: [],
        isSetPlayerSeed: [],
      };
      for (let i = 0; i < SHA_CHAIN_NUM; i += 1) {
        slotGenesisInfo.val.push(Math.random().toString());
      }
      Store.set(slotAddress, slotGenesisInfo);
      console.log('first slotGenesisRandomNumber ', Store.get(slotAddress));
    }
  }

  occupySlotMachine(slotMachineContract, playerAddress, weiValue) {
    return new Promise((resolve, reject) => {
      console.log('Start to Occupy slot machine');
      const shaArr = [];
      Store.update(slotMachineContract.address, slotGenesisInfo => {
        const shaCount = Math.ceil(slotGenesisInfo.round / 3);
        for (let i = 0; i < SHA_CHAIN_NUM; i += 1) {
          shaArr.push(this.makeS3Sha(shaCount, slotGenesisInfo.val[i]));
        }
        console.log('shaCount is ', shaCount);
        console.log('start sha is ', shaArr);
        slotGenesisInfo.round -= 1;
      });
      slotMachineContract.occupy(shaArr, { from: playerAddress, value: weiValue, gas: 2200000 }, err => {
        if (err) {
          reject(err);
        } else {
          this.getContractPendingTransaction(slotMachineContract, 'bankerSeedInitialized')
            .then(result => {
              console.log('Success to all of the occupy slot machine step. bankerSeedInitialized');
              resolve(result);
            })
            .catch(error => {
              reject(error);
            });
        }
      });
    });
  }

  async getContractPendingTransaction(slotMachineContract, eventName) {
    return await new Promise((resolve, reject) => {
      console.log('eventName is ', eventName);
      const contractFilter = this.web3.eth.filter({
        fromBlock: 'pending',
        toBlock: 'pending',
      });
      contractFilter.watch((err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          const encodedSha = SLOT_TOPICS_ENCODED[eventName];
          if (result.address === slotMachineContract.address) {
            for (let i = 0; i < result.topics.length; i += 1) {
              if (result.topics[i] === encodedSha) {
                contractFilter.stopWatching();
                resolve(result);
              }
            }
          }
        }
      });
    });
  }

  playSlotMachine(playInfo) {
    return new Promise((resolve, reject) => {
      const slotMachineContract = playInfo.slotMachineContract;
      const slotMachineContractAddress = slotMachineContract.address;
      const round = Store.get(slotMachineContractAddress).round;
      const chainIndex = round % 3;
      console.log('game Start! round is ', round);
      console.log('chainIndex is ', chainIndex);
      slotMachineContract.initGameForPlayer(
        this.makeWeiFromEther(parseFloat(playInfo.betSize, 10)),
        playInfo.lineNum,
        chainIndex,
        {
          from: playInfo.playerAddress,
          gas: 1592450,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log('initGameforPlayer Over.', result);
            this.getContractPendingTransaction(slotMachineContract, 'bankerSeedSet')
              .then(result2 => {
                console.log('bankerSeedSet event txhash is ', result2.transactionHash);
                const isSetPlayerSeed = Store.get(slotMachineContractAddress).isSetPlayerSeed;
                if (!isSetPlayerSeed.includes(result.transactionHash)) {
                  let sha;
                  Store.update(slotMachineContractAddress, slotGenesisInfo => {
                    const shaVal = slotGenesisInfo.val[chainIndex];
                    const shaCount = Math.ceil(slotGenesisInfo.round / 3);
                    sha = this.makeS3Sha(shaCount, shaVal);
                    console.log(`round is ${round}, chainIndex is ${chainIndex}, sha is ${sha}`);
                    slotGenesisInfo.round -= 1;
                    slotGenesisInfo.isInitWatched.push(result2.transactionHash);
                  });
                  slotMachineContract.setPlayerSeed(
                    sha,
                    chainIndex,
                    {
                      from: playInfo.playerAddress,
                      gas: 1000000,
                    },
                    async (err2, result3) => {
                      if (err2) {
                        reject(err2);
                      } else {
                        resolve(result3);
                      }
                    },
                  );
                }
              })
              .catch(err2 => {
                console.log(err2);
                reject(err2);
              });
          }
        },
      );
    });
  }

  async getSlotResult(slotMachineContract) {
    return await new Promise((resolve, reject) => {
      this.getContractPendingTransaction(slotMachineContract, 'gameConfirmed')
        .then(result => {
          // It because the result combined with 2 uint format data.
          const uintResult = result.data.substring(0, 66);
          const weiResult = this.web3.toDecimal(`${uintResult}`);
          const ethResult = this.makeEthFromWei(weiResult);
          resolve(ethResult);
        })
        .catch(error => {
          console.log('getSlotResult error is ', error);
          reject(error);
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

  makerPendingWatcher(slotMachineContracts, bankerAddress) {
    const contractFilter = this.web3.eth.filter({
      fromBlock: 'pending',
      toBlock: 'pending',
    });

    const addressList = slotMachineContracts.map(slotMachineContract => {
      const slotMachineContractAddress = slotMachineContract.get('contract').address;
      this.createGenesisRandomNumber(slotMachineContractAddress);
      return slotMachineContractAddress;
    });

    contractFilter.watch((err, result) => {
      if (err) {
        console.error(err);
      } else if (addressList.includes(result.address)) {
        const occupiedTopic = SLOT_TOPICS_ENCODED.gameOccupied;
        const initializedTopic = SLOT_TOPICS_ENCODED.gameInitialized;

        if (result.topics) {
          result.topics.forEach(topic => {
            const slotMachineContract = slotMachineContracts.find(slotMachine => {
              return slotMachine.get('contract').address === result.address;
            });

            switch (topic) {
              case occupiedTopic:
                this.watchGameOccupied(slotMachineContract.get('contract'), bankerAddress);
                break;
              case initializedTopic:
                this.watchGameInitialized(slotMachineContract.get('contract'), bankerAddress, result.transactionHash);
                break;
              default:
                break;
            }
          });
        }
      }
    });
  }

  async watchGameOccupied(slotMachineContract, bankerAddress) {
    const slotMachineContractAddress = slotMachineContract.address;
    const isOccuWatched = Store.get(slotMachineContractAddress).isOccuWatched;

    if (!isOccuWatched) {
      const shaArr = [];
      Store.update(slotMachineContract.address, slotGenesisInfo => {
        const shaCount = Math.ceil(slotGenesisInfo.round / 3);
        for (let i = 0; i < SHA_CHAIN_NUM; i += 1) {
          shaArr.push(this.makeS3Sha(shaCount, slotGenesisInfo.val[i]));
        }
        console.log('shaArr is ', shaArr);
        console.log('shaCount is ', shaCount);
        slotGenesisInfo.round -= 1;
        slotGenesisInfo.isOccuWatched = true;
      });
      console.log('Store is ', Store.get(slotMachineContract.address));

      slotMachineContract.initBankerSeed(shaArr, { from: bankerAddress, gas: 2200000 }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          Toast.notie.alert({
            text: `Your Slotmachine ${slotMachineContractAddress} is occupied.`,
          });
        }
      });
    }
  }

  async watchGameInitialized(slotMachineContract, bankerAddress, txHash) {
    const slotMachineContractAddress = slotMachineContract.address;
    const isInitWatched = Store.get(slotMachineContractAddress).isInitWatched;

    if (!isInitWatched.includes(txHash)) {
      let sha;
      let chainIndex;
      Store.update(slotMachineContractAddress, slotGenesisInfo => {
        chainIndex = slotGenesisInfo.round % 3;
        const shaVal = slotGenesisInfo.val[chainIndex];
        console.log('shaVal is ', shaVal);
        const round = slotGenesisInfo.round;
        const shaCount = Math.ceil(round / 3);
        sha = this.makeS3Sha(shaCount, shaVal);
        console.log(`Round is ${round} chainIndex is ${chainIndex}, shaCount is ${shaCount}, sha is ${sha}`);
        slotGenesisInfo.round -= 1;
        slotGenesisInfo.isInitWatched.push(txHash);
      });
      slotMachineContract.setBankerSeed(sha, chainIndex, { from: bankerAddress, gas: 2200000 }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          Toast.notie.alert({
            text: `Your Slotmachine ${slotMachineContractAddress} is initialized.`,
          });

          Store.update(slotMachineContractAddress, slotGenesisInfo => {
            slotGenesisInfo.isInitWatched.push(txHash);
          });
        }
      });
    }
  }
}

const web3Service = new Web3Service();

export default web3Service;
