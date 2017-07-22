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
  - bool mAvailable

    true if player can play game  
    false if provider shutdown the slotmachine

  - bool public mBankrupt

  - address mPlayer

    address of current playerBalance

  - uint mDecider
  - uint mMinBet
  - uint mMaxBet

  - uint mMaxPrize

  - uint providerBalance

    provider's balance in slotmachine (wei)

  - uint playerBalance

    player's balance in slotmachine (wei)

  - bytes32 previousPlayerSeed;
  - bytes32 previousProviderSeed;

  - mapping (bytes32 => game) mGames;
    - 

### methods
  - occupy(bytes32 _playerSeed)

    player enters the game  
    send ether  
    set mPlayer with address of player  
    set initial player seed with _playerSeed  
    event : gameOccupied

  - initProviderSeed(bytes32 _providerSeed)  

    set initial provider seed  
    event : providerSeedInitialized

  - initGameforPlayer(uint _bet, uint _lines)

    start slot game with parameters  
    event : gameInitialized

  - setProviderSeed(bytes32 _providerSeed)

    onlyProvider  
    set current game seed for provider  
    event : providerSeedSet

  - setPlayerSeed(bytes32 _playerSeed)

    onlyPlayer  
    set current game seed for player  
    play confirm, caculate the game  
    event : gameConfirmed

  - leave()  

    onlyPlayer  
    access : onlyPlayer  
    player leaves the game  
    give back the balance to player  
    event : playerLeft

### events
  - playerLeft(address player, uint playerBalance)  
    - player : address of player
    - playerBalance : balance of initial balance


  - providerLeft(address provider)
    - provider : address of provider


  - gameOccupied(address player, uint playerBalance)
    - player : address of player


  - providerSeedInitialized(bytes32 _providerSeed)
    - _providerSeed : initial seed for provider


  - gameInitialized(address player, uint bet, uint lines)
    - player : address of player
    - bet : current game bet
    - lines : current game lines


  - providerSeedSet(bytes32 providerSeed)
    - providerSeed : current game seed for provider


  - gameConfirmed(bytes32 gameId, uint reward)
    - gameId : currentGameId
    - reward : final reward for player

### playing example

```javascript
//get slotmachine instance
var slot = SlotMachine(slotaddr)

//send provider's ether to slotmachine
web3.eth.sendTransaction({from:provider, to:slotaddr, value : web3.toWei(1,"ether")})

//shows provider's ether
slot.providerBalance()

//player occupies the slotmachine, send ether
 slot.occupy('0x11',{from:user2,value:web3.toWei(2,"ether")})

//set initial provider seed
slot.initProviderSeed('0x22')

//player press button 'play'
slot.initGameforPlayer(500,20,{from:user2})

//provider sets seed for current game
slot.setProviderSeed('0x99')

//player sets seed for current game, caculate reward
slot.setPlayerSeed('0x88',{from:user2})





//player leaves the game, get back his/her ether
slot.leave({from:player})
```
