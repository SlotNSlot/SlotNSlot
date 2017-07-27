#SlotMachine API

---
SlotMachine
  - event gameOccupied changed  
    gameOccupied(address player, uint playerBalance) => (address player, uint playerSeed)


---
General
  - reduced gas usage on playing game, creating slotmachine
  - applied paytablestorage, all combinations of (maxprize, decider) are available  


SlotMachineManager
  - event slotMachineCreated :  parameter maxPrize added
  - removeSlotMachine : refunding to owner added  

SlotMachine
  - Game struct changed
  - function *checksha, checkseed* deleted
  - event gameConfirmed changed,  
    gameConfirmed(bytes32 gameid, uint reward) => gameConfirmed(uint reward)
  - initGameforPlayer, setProviderSeed, setPlayerSeed does *not* have to be sent to contract in proper order

---
## SlotMachineManager

###methods

- createSlotMachine(uint _decider, uint _minBet, uint _maxBet, uint _maxPrize) returns (address)

  create slotmachine with following parameters  
  return address of created slotmachine  
  event : slotMachineCreated  

- removeSlotMachine(uint _idx)

  remove slotmachine[_idx] from slotmachine array, rest of arrays will be sorted automatically
  refund slotmachine's deposit to provider
  event : slotMachineRemoved

- getStorageAddr() returns (address)

  return slotmachineStorage address


###events
  - slotMachineCreated (address _provider, uint _decider, uint _minBet, uint _maxBet, uint _maxPrize, uint _totalnum, address _slotaddr)  

    arguments :  

    >_provider : address of provider  
    _decider, _minBet, _maxBet, _maxPrize : given parameters  
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

    address of current player  
    if slot is not occupied, mPlayer = '0x0'    

  - uint mDecider

    hit rate of slotmachine * 1000  
    e.g) hit rate : 15%(0.15) => mDecider : 150

  - uint mMinBet

    minBet of slotmachine(wei)

  - uint mMaxBet

    maxBet of slotmachine(wei)

  - uint mMaxPrize

  - bool mIsGamePlaying;

    true if game is initialized by initGameforPlayer, until game is confirmed by setPlayerSeed
    after gameConfirmed event triggered, it is set false;

  - uint providerBalance

    provider's balance in slotmachine (wei)

  - uint playerBalance

    player's balance in slotmachine (wei)

  - bytes32 previousPlayerSeed

    stores playerseed of the previous game

  - bytes32 previousProviderSeed

    stores providerseed of the previous game

  - bool public initialPlayerSeedReady

    true if initial player seed is set by *occupy*

  - bool public initialProviderSeedReady

    true if initial provider seed is set by *setProviderSeed*

  - mapping (address => uint) public mNumGamePlayedByUser;

    increased if game is initialized by *initGameforPlayer*

  - mapping (bytes32 => bool) public mUsedPlayerSeeds;

  - bytes32 mCurrentGameId;

    stores current game id, which is set in *initGameforPlayer*  

  - Game mGames[bytes32 gameid];

    stores game information for each round  

    ```solidity
    struct Game {
        GameState gameState;
        address player;
        uint bet;
        bytes32 providerSeed;
        uint providerNumber;
        bytes32 playerSeed;
        uint playerNumber;
        uint randomNumber;
        bool providerSeedReady;
        bool playerSeedReady;
        uint numofLines;
        uint reward;
    }

    enum GameState {
        INITIALIZED,  //initGameforPlayer()
        PROVIDERSEEDSET,  //setProviderSeed()
        PLAYERSEEDSET,  //setPlayerSeed()
        END //gameConfirmed;
    }
    ```

  - all public variables have getter function
    ```js
      //get game informations in struct Game
      gameid = slot.mCurrentGameId();
      slot.mGames(gameid);

      //get current game id
      slot.mCurrentGameId();

      //get player balance
      slot.playerBalance();

      //get number of games played by user
      slot.mNumGamePlayedByUser(useraddress);
      ...
    ```


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

    if game is set properly, trigger event : gameConfirmed

  - setProviderSeed(bytes32 _providerSeed)

    onlyProvider  
    set current game seed for provider  
    event : providerSeedSet

    if game is set properly, trigger event : gameConfirmed

  - setPlayerSeed(bytes32 _playerSeed)

    onlyPlayer  
    set current game seed for player  
    play confirm, caculate the game  
    event : playerSeedSet

    if game is set properly, trigger event : gameConfirmed

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


  - gameOccupied(address player, bytes32 playerSeed)
    - player : address of player
    - playerSeed : initial playerSeed


  - providerSeedInitialized(bytes32 providerSeed)
    - providerSeed : initial seed for provider


  - gameInitialized(address player, uint bet, uint lines)
    - player : address of player
    - bet : current game bet
    - lines : current game lines


  - providerSeedSet(bytes32 providerSeed)
    - providerSeed : current game seed for provider


  - playerSeedSet(bytes32 playerSeed)
    - playerSeed : current game seed for provider


  - gameConfirmed(uint reward)
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
 slot.occupy('0x11',{from:player,value:web3.toWei(2,"ether")})

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
