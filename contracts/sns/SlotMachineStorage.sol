pragma solidity ^0.4.0;


import '../zeppelin/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
//    user[] public userdata;
    /*struct slot {address slotaddress; bool deleted;}*/

    address[] public provideraddress;
    mapping (address => address[]) public slotMachines;

    uint public totalNumofSlotMachine;


    event providerAdded(address _provider, uint _slotnum);
    /*event ownershipTransferred(address _before, address _after);*/


    function SlotMachineStorage (){
        totalNumofSlotMachine = 0;
    }

    function getOwner() constant returns (address) {
        return owner;
    }

    function addProvider(address _provider, uint _slotnum) private {
        if (!isValidProvider(_provider)){
          provideraddress.push(_provider);
          providerAdded(_provider, _slotnum);
        }
    }

    function isValidProvider(address _provider) constant returns (bool){
        return (slotMachines[_provider].length != 0);
    }


    function getNumofProvider() constant returns (uint) {
        return provideraddress.length;
    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet)
  //      onlyOwner
        returns (address)
    {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet));
        addProvider(_provider, 1);
        slotMachines[_provider].push(newslot);
        /*slotMachines[_provider][0] = newslot;*/
        totalNumofSlotMachine++;
        return newslot;
    }

    function removeSlotMachine(address _provider, uint _idx)
        onlyOwner
    {
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



    function getSlotMachineDecider(address _provider, uint _idx)
  //      onlyOwner
        constant returns (uint)
    {
        return (SlotMachine(slotMachines[_provider][_idx]).mDecider());
    }

    function getSlotMachineInfo(address _provider, uint _idx)
        onlyOwner
        constant returns (uint, uint, uint)
    {
        uint totalnum = getNumofSlotMachine(_provider);
        if (_idx < totalnum) {
          return (SlotMachine(slotMachines[_provider][_idx]).getInfo());
        }
        else {
          return (0,0,0);
        }

    }

    function getSlotMachineInfos(address _provider, uint _idx)
  //      onlyOwner
        constant returns (uint[10], uint[10], uint[10])
    {
        uint[10] memory deciders;
        uint[10] memory minbets;
        uint[10] memory maxbets;
        for(uint i = _idx; i < _idx + 10; i++){
          (deciders[i], minbets[i], maxbets[i]) = getSlotMachineInfo(_provider, i);
        }

        return (deciders, minbets, maxbets);
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

    function getSlotMachines(address _provider, uint _idx)
        //onlyOwner
        constant returns(address[5])
    {
        address[5] memory returnslots;
        for (uint i = _idx; i < _idx + 5; i++){
          returnslots[i - _idx] = getSlotMachine(_provider, i);
        }
        return returnslots;
    }


}
