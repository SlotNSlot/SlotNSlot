#SlotMachine API
---
## SlotMachineManager

###methods

- createSlotMachine(uint _decider, uint _minBet, uint _maxBet) returns (address)

  create slotmachine with following parameters  
  trigger event slotMachineCreated  
  return address of created slotmachine

- removeSlotMachine(uint _idx)

  remove slotmachine[_idx] from slotmachine array, rest of arrays will be sorted automatically

- getStorageAddr() returns (address)

  return slotmachineStorage address


###events
  - slotMachineCreated (address _provider, uint _decider, uint _minBet, uint _maxBet, uint _totalnum, address _slotaddr)  

    arguments :  

    >_provider : address of provider  
    _decider, _minBet, maxBet : given parameters  
    _totalnum : number of user's slotmachine after creation  
    _slotaddr : address of created slotmachine

   - slotMachineRemoved(address _provider, address _slotaddr, uint _totalnum)  

      arguments :
      >_provider : address of provider  
      _slotaddr : address of removed slotmachine  
      _totalnum : number of user's slotmachine after removal  
---

## SlotMachineStorage

### data
  - address[] provideraddress

    array of provider addresses

  - mapping (address => address[]) slotMachines

    mapping (provider => array of slotmachines)

  - uint totalNumofSlotMachine;

    total number of slotmachines regardless of provider

### methods
  - isValidProvider (address _provider) constant returns (bool)

    return if _provider has at least 1 slotmachine

  - getNumofProvider () constant returns (uint)

    return number of providers

  - getNumofSlotMachine (address _provider) constant returns (uint)

    return number of slomachines provided by _provider

  - getSlotMachine (address _provider, uint _idx) constant  returns (address)

    return slotmachine address of _provider, index with _idx



  - getSlotMachines (address _provider, uint _idx)

    get 5 addresses of slotmachines from given index.  
    if number of slotmachines are less then 5, rest of addresses are filled with '0x0'.
