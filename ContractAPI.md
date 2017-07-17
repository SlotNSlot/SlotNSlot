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
  trigger event slotMachineRemoved

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

### variable
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

---

## SlotMachine

### variable
  - bool public mAvailable;

  -  bool public mBankrupt;
  -  address public mPlayer;

  -  uint public mDecider;
  -  uint public mMinBet;
  -  uint public mMaxBet;

  - uint public providerBalance;
  - uint public playerBalance;


###methods
  - occupy()
  - leave()
  - shutDown()
  - initGame(bytes32 _providerSeed, bytes32 _playerSeed)
  - confirmGame(uint _providerNumber, uint _playerNumber)
  
  - getInfo()
