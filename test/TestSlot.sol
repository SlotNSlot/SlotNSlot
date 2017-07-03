pragma solidity ^0.4.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/sns/SlotMachineManager.sol";
import "../contracts/sns/SlotMachine.sol";

contract TestSlot {
    function test(){
        SlotMachineManager manager = SlotMachineManager(DeployedAddresses.SlotMachineManager());
        manager.createSlotMachine(0x0,1,1000,10000);
        manager.createSlotMachine(0x0,2,2000,20000);
        manager.createSlotMachine(0x0,3,3000,30000);
        manager.createSlotMachine(0x0,4,4000,40000);
        manager.createSlotMachine(0x0,5,5000,50000);

        uint expected = 5;
        Assert.equal(manager.getNumofSlotMachine(),expected,"There should be 5 machines, creating failed");


        manager.removeSlotMachine(0);
        expected = 4;
        Assert.equal(manager.getNumofSlotMachine(),expected,"There should be 4 machines, removing failed");

        uint expectedData = 2;
        uint resultData = 0;

        resultData = manager.getSlotMachineDecider(0);
        Assert.equal(resultData,expectedData,"expectedData should be 30, reading slotmachine data failed");
        //Assert.equal(resultBalance,expectedBalance,"expectedBalance should be 3000, reading slotmachine data failed");



    }


}
