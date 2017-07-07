import Web3 from 'web3';
import contract from 'truffle-contract';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.MetaCoin = null;

    if (typeof web3 !== 'undefined') {
      console.warn(
        "Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        "No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    // Set MetaCoin Provider
    this.getMetaCoinContract().setProvider(this.web3.currentProvider);
  }

  getWeb3() {
    return this.web3;
  }

  getMetaCoinContract() {
    if (!this.MetaCoin) {
      // this.MetaCoin = contract(metacoinArtifacts);
    }
    return this.MetaCoin;
  }
}

const web3Service = new Web3Service();
export default web3Service;
