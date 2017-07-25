// Allows us to use ES6 in our migrations and tests.
require('babel-register');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    live: {
      network_id: 1,
      host: 'localhost',
      port: 8545
    },
    rinkeby: {
      network_id: 4,
      host: 'localhost',
      port: 8545,
      gas: 4000000
    }
  },
  rpc: {
    host: 'localhost',
    port: 8545
  }
};
