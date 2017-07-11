pragma solidity ^0.4.0;


import '../zeppelin/ownership/Ownable.sol';
import "./SlotMachine.sol";

contract SlotMachineStorage is Ownable {
    address[] private useraddress;
    mapping (address => address[]) slotMachines;
    uint private slotMachinesTotalnum;
    //event slotMachineCreated(address provider, uint decider, uint minBet, uint maxBet);

    event userAdded(address _user);

    function SlotMachineStorage (){

    }

    function getOwner() constant returns (address) {
        return owner;
    }

    function addUser(address _user) {
        if (!isUserexist(_user)){
          useraddress.push(_user);
          userAdded(_user);
        }
    }

    function getUser(uint _idx) constant returns (address) {
        return useraddress[_idx];
    }

    function isUserexist(address _user) constant returns (bool){
        if (slotMachines[_user].length == 0) {
          return false;
        }
        else {
          return true;
        }
    }

    function getUserSlot(address _user) constant returns (uint) {
      return slotMachines[_user].length;
    }

    function removeUser(uint _idx) {
        uint totalnum = useraddress.length;
    }

    function getNumofUser() constant returns (uint) {
        return useraddress.length;
    }

    function createSlotMachine (address _provider,  uint _decider, uint _minBet, uint _maxBet)
      //  onlyOwner
    returns (address)
    {
        address newslot = address(new SlotMachine(_provider, _decider, _minBet, _maxBet));
        addUser(_provider);
        slotMachines[_provider].push(newslot);
        slotMachinesTotalnum++;
        return newslot;
    }

    function removeSlotMachine(address _provider, uint _idx)
      //  onlyOwner
    {
        delete slotMachines[_provider][_idx];
        slotMachines[_provider].length--;
        slotMachinesTotalnum--;
    }
    function setSlotMachine(address _provider, uint _idx, address _newslotMachine)
      //onlyOwner
    {
        slotMachines[_provider][_idx] = _newslotMachine;
    }

    function getNumofSlotMachine(address _provider)
  //    onlyOwner
        constant returns (uint)
    {
        return slotMachines[_provider].length;
    }

    function getTotalNumofSlotMachine()
    //onlyOwner
        constant returns (uint)
    {
        return slotMachinesTotalnum;
    }        /*slotMachines.push(newslot);*/


    function getSlotMachineDecider(address _provider, uint _idx)
    //  onlyOwner
        constant returns (uint)
    {
        return (SlotMachine(slotMachines[_provider][_idx]).mDecider());
    }

    //  onlyOwner
    function getSlotMachineInfo(address _provider, uint _idx)
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
        constant returns(address[5])
    {
        address[5] memory returnslots;
        for (uint i = _idx; i < _idx + 5; i++){
          returnslots[i - _idx] = getSlotMachine(_provider, i);
        }
        return returnslots;
    }


}
