pragma solidity ^0.4.0;


import '../zeppelin/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
//    user[] public userdata;
    /*struct slot {address slotaddress; bool deleted;}*/

    address[] public provideraddress;
    mapping (address => address[]) public slotMachines;

    uint public totalNumofSlotMachine;

    uint test;
  //  event providerAdded(address _provider, uint _slotnum);

    function SlotMachineStorage (){
        totalNumofSlotMachine = 0;
        test = 100;
    }


    function addProvider(address _provider, uint _slotnum) private {
        if (!isValidProvider(_provider)){
          provideraddress.push(_provider);
        //  providerAdded(_provider, _slotnum);
        }
    }

    function isValidProvider(address _provider) constant returns (bool){
        return (slotMachines[_provider].length != 0);
    }

    function getNumofProvider() constant returns (uint) {
        return provideraddress.length;
    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet, uint _maxPrize)
      //  onlyOwner
        /*payable*/
        returns (address)
    {
      address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet, _maxPrize));

        /*address newslot = address((new SlotMachine).value(msg.value)(_provider, _decider, _minBet, _maxBet, _maxPrize));*/
        addProvider(_provider, 1);
        slotMachines[_provider].push(newslot);
        totalNumofSlotMachine++;
        return newslot;
    }

    function removeSlotMachine(address _provider, uint _idx)
        onlyOwner
    {
        SlotMachine(slotMachines[_provider][_idx]).shutDown();
        delete slotMachines[_provider][_idx];
        slotMachines[_provider].length--;
        totalNumofSlotMachine--;
    }

    function setSlotMachine(address _provider, uint _idx, address _newslotMachine)
        onlyOwner
    {
        slotMachines[_provider][_idx] = _newslotMachine;
    }

    function getNumofSlotMachine(address _provider)
    //    onlyOwner
        constant returns (uint)
    {
        return slotMachines[_provider].length;
    }

    function getSlotMachine(address _provider, uint _idx)
      //  onlyOwner
        constant returns(address)
    {
        if (_idx < slotMachines[_provider].length) {
          return slotMachines[_provider][_idx];
        }
        else {
          return 0x0;
        }
    }


}
