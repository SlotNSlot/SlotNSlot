# SlotMachineManager

##methods

- createSlotMachine(uint _decider, uint _minBet, uint _maxBet)

  create slotmachine with following parameters  
  trigger event slotMachineCreated

- removeSlotMachine(uint _idx)

  remove slotmachine[_idx] from slotmachine array, rest of arrays will be sorted automatically

- getNumofSlotMachine() constant returns (uint)

  get number of user's slotmachines

- getSlotMachines(uint _idx) constant returns (address[5])

  get 5 addresses of slotmachines from given index.  
  if number of slotmachines are less then 5, rest of addresses are filled with '0x0'.


- getSlotMachineInfo(uint _idx) constant returns (uint, uint, uint)

  return slotmachine information (decider, minBet, maxBet)  
  if there is no matched index, return (0,0,0)


##events
  - slotMachineCreated(address _provider, uint _decider, uint _minBet, uint _maxBet, uint _totalnum, address _slotaddr)  

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
