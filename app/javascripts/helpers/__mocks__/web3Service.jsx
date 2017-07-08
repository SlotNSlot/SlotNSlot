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
}

const web3Service = new Web3Service();
export default web3Service;
