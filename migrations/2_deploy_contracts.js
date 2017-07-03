 //
 // var ConvertLib = artifacts.require("./ConvertLib.sol");
 // var MetaCoin = artifacts.require("./MetaCoin.sol");
 // var MetaCoinLib = artifacts.require("./sns/MetaCoinLib.sol");


var SlotMachineStorage = artifacts.require("./sns/SlotMachineStorage.sol");
var SlotManager = artifacts.require("./sns/SlotMachineManager.sol");
var SlotLib = artifacts.require("./sns/SlotLib.sol");

module.exports = function(deployer) {


    deployer.deploy(SlotLib);
    


};
