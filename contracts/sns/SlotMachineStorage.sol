pragma solidity ^0.4.0;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
    address public payStorage;
    address[] public provideraddress;
    mapping (address => address[]) public slotMachines;

    uint public totalNumofSlotMachine;

    function SlotMachineStorage (){
        totalNumofSlotMachine = 0;
    }

    function setPaytableStorage(address _payStorage) {
        payStorage = _payStorage;
    }

    function addProvider(address _provider, uint _slotnum) private {
        if (slotMachines[_provider].length != 0){
          provideraddress.push(_provider);
        }
    }

    function getNumofProvider() constant returns (uint) {
        return provideraddress.length;
    }

    function createSlotMachine (address _provider,  uint16 _decider, uint _minBet, uint _maxBet, uint16 _maxPrize)
        onlyOwner
        returns (address)
    {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet, _maxPrize, payStorage));
        addProvider(_provider, 1);
        slotMachines[_provider].push(newslot);
        totalNumofSlotMachine++;
        return newslot;
    }

    function removeSlotMachine(address _provider, address _slotaddr)
        onlyOwner
    {
        SlotMachine(_slotaddr).shutDown();
        slotMachines[_provider].length--;
        totalNumofSlotMachine--;
    }

    function deleteSlotMachineinArray(address _provider, uint _idx) {
        delete slotMachines[_provider][_idx];
    }

    function setSlotMachine(address _provider, uint _idx, address _newslotMachine)
        onlyOwner
    {
        slotMachines[_provider][_idx] = _newslotMachine;
    }

    function getNumofSlotMachine(address _provider)
        constant returns (uint)
    {
        return slotMachines[_provider].length;
    }

    function getSlotMachine(address _provider, uint _idx)
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
