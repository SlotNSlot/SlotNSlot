 //
 // var ConvertLib = artifacts.require("./ConvertLib.sol");
 // var MetaCoin = artifacts.require("./MetaCoin.sol");
 // var MetaCoinLib = artifacts.require("./sns/MetaCoinLib.sol");


var SlotMachineStorage = artifacts.require("./sns/SlotMachineStorage.sol");
var SlotMachineManager = artifacts.require("./sns/SlotMachineManager.sol");
var SlotLib = artifacts.require("./sns/SlotLib.sol");
var SlotLib2 = artifacts.require("./sns/SlotLib2.sol");
var Dispatcher = artifacts.require("./Dispatcher.sol");
var DispatcherStorage = artifacts.require("./DispatcherStorage.sol");


module.exports = function(deployer) {

    deployer.deploy(SlotLib).then(function() {
      console.log('SlotLib address : ', SlotLib.address);
      return deployer.deploy(DispatcherStorage, SlotLib.address);
    }).then(function () {
      console.log('DispatcherStorage address : ', DispatcherStorage.address);
     console.log('unlinked_binary : ', Dispatcher.unlinked_binary);
      Dispatcher.unlinked_binary = Dispatcher.unlinked_binary
        .replace('1111222233334444555566667777888899990000',
        DispatcherStorage.address.slice(2));
      console.log('unlinked_binary : ', Dispatcher.unlinked_binary);

      }).then(function () {
        return deployer.deploy(Dispatcher).then(function (){
          console.log('Dispatcher address : ', Dispatcher.address);
          SlotMachineManager.link('LibInterface', Dispatcher.address);
          return deployer.deploy(SlotMachineManager).then(function () {
            console.log('SlotMachineManager address : ', SlotMachineManager.address);
          });

        });
      });
      deployer.deploy(SlotLib2).then(function() {
        console.log('SlotLib2 address : ', SlotLib2.address);
      });

};
