class Web3Service {
  constructor() {
    this.web3 = null;
    this.MetaCoin = {
      deployed: Promise.resolve(),
    };
  }

  getWeb3() {
    return this.web3;
  }

  getMetaCoinContract() {
    return this.MetaCoin;
  }

  createSlotMachine({ account, decider, minBet, maxBet, maxPrize }) {
    if (account === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve({
      args: {
        _slotaddr: 'mockAddress',
      },
    });
  }

  getNumOfSlotMachine(account) {
    if (account === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve(3);
  }

  getSlotMachineAddressFromProvider(providerAddress, index) {
    if (providerAddress === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve('kdsjflvncnxmnsdnjnqwnjndsjncncncjsdjkas');
  }

  getTheNumberOfProviders() {
    return Promise.resolve(3);
  }

  getSlotMachineContract(slotAddress) {
    if (slotAddress === 'forceFail') {
      return undefined;
    }
    return {
      abi: [1, 2, 3, 4, 6],
      address: '3uisdfjksdnc3j2',
    };
  }

  getSlotMachineInfo(slotMachineContract) {
    if (slotMachineContract === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve({
      minBet: 0.001,
      maxBet: 0.003,
      name: 'mockSlotMachine',
    });
  }

  getProviderAddress(index) {
    return Promise.resolve('kdsjflvncnxmnsdnjnqwnjndsjncncncjsdjkas');
  }

  getSlotMachines(account) {
    if (account === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve({
      account,
    });
  }

  sendProivderEtherToSlotMachine({ from, to, etherValue }) {
    return Promise.resolve();
  }
}

const web3Service = new Web3Service();
export default web3Service;
