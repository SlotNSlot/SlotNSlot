 // var MetaCoin = artifacts.require("./MetaCoin.sol");
var SlotMachineStorage = artifacts.require("./sns/SlotMachineStorage.sol");
var SlotMachineManager = artifacts.require("./sns/SlotMachineManager.sol");
var SlotLib = artifacts.require("./sns/SlotLib.sol");
var SlotLib2 = artifacts.require("./sns/SlotLib2.sol");
var Dispatcher = artifacts.require("./Dispatcher.sol");
var DispatcherStorage = artifacts.require("./DispatcherStorage.sol");
// var SlotMachine = artifacts.require("./sns/SlotMachine.sol");
var PaytableStorage = artifacts.require("./sns/PaytableStorage.sol");

module.exports = function(deployer) {

  //deployer.deploy(MetaCoin);

    deployer.deploy(SlotLib).then(function() {
      console.log('SlotLib address : ', SlotLib.address);
      return deployer.deploy(DispatcherStorage, SlotLib.address);
    })
    .then(function () {
      console.log('DispatcherStorage address : ', DispatcherStorage.address);
      console.log('unlinked_binary : ', Dispatcher.unlinked_binary);
    })
    .then(() => {
      Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
        .replace('1111222233334444555566667777888899990000',
        DispatcherStorage.address.slice(2));
    })
    .then(() => {
      console.log('unlinked_binary : ', Dispatcher.unlinked_binary);
      deployer.deploy(PaytableStorage).then(function() {
        console.log('PaytableStorage created', PaytableStorage.address);
      });
    })
    .then(() => {
      deployer.deploy(SlotMachineStorage).then(function() {
        console.log('SlotMachineStorage address : ', SlotMachineStorage.address);
      });
    })
    .then(function () {
      return deployer.deploy(Dispatcher).then(function (){
        console.log('Dispatcher address : ', Dispatcher.address);
        SlotMachineManager.link('LibInterface', Dispatcher.address);
        return deployer.deploy(SlotMachineManager, SlotMachineStorage.address).then(function (instance) {
          console.log('SlotMachineManager address : ', SlotMachineManager.address);
          return;
        })

      });
    });
    // deployer.deploy(PaytableStorage);

    // deployer.deploy(SlotMachine,'0x551c8a4403eb796ae72b9f144a5934d7903684dc',150,100,10000,1000);
    // deployer.deploy(SlotMachineStorage);
    // deployer.deploy(SlotLib2).then(function() {
    //   console.log('SlotLib2 address : ', SlotLib2.address);
    // });

};
