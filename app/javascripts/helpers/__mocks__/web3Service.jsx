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

  createSlotMachine(account) {
    if (account === 'forceFail') {
      return Promise.reject();
    }
    return Promise.resolve({
      account,
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
}

const web3Service = new Web3Service();
export default web3Service;
