pragma solidity ^0.4.0;
import "./LibInterface.sol";
import "./SlotMachineStorage.sol";

library SlotLib2 {

    event slotMachineCreated(address _provider, uint16 _decider, uint _minBet, uint _maxBet, uint16 _maxPrize, uint _totalnum, address _slotaddr);
    event slotMachineRemoved(address _provider, address _slotaddr, uint _totalnum);


    //create new slotmachine
    function createSlotMachine (address _slotmachineStorage, address _provider,  uint16 _decider, uint _minBet, uint _maxBet, uint16 _maxPrize) returns (address) {
        address newslot = address(SlotMachineStorage(_slotmachineStorage).createSlotMachine(_provider, _decider, _minBet, _maxBet, _maxPrize));
        slotMachineCreated(_provider, _decider, _minBet, _maxBet, _maxPrize, SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine(_provider),newslot);
        return newslot;
    }

    function removeSlotMachine (address _slotmachineStorage, address _provider, uint _idx) {
        uint totalnum = SlotMachineStorage(_slotmachineStorage).getNumofSlotMachine(_provider);
        address slottoremove = SlotMachineStorage(_slotmachineStorage).getSlotMachine(_provider, _idx);
        require(_idx < totalnum);

        for (uint i = _idx; i < totalnum-1 ; i++){
            SlotMachineStorage(_slotmachineStorage).setSlotMachine(_provider, i, SlotMachineStorage(_slotmachineStorage).getSlotMachine(_provider, i + 1));
        }

        SlotMachineStorage(_slotmachineStorage).setSlotMachine(_provider, totalnum-1, address(0x0));
        SlotMachineStorage(_slotmachineStorage).removeSlotMachine(_provider, slottoremove);
        slotMachineRemoved(_provider, slottoremove, totalnum-1);
    }


}
