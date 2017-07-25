pragma solidity ^0.4.0;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './PaytableStorage.sol';


contract SlotMachine is Ownable {
    bool public mAvailable;
    bool public mBankrupt;
    address public mPlayer;
    uint16 public mDecider;
    uint public mMinBet;
    uint public mMaxBet;
    uint16 public mMaxPrize;

    address public payStorage;

    bool public mIsGamePlaying;
    bytes32 public mCurrentGameId;


    uint public providerBalance;
    uint public playerBalance;

    bytes32 public previousPlayerSeed;
    bytes32 public previousProviderSeed;

    bool public initialPlayerSeedReady;
    bool public initialProviderSeedReady;

    mapping (address => uint) public mNumGamePlayedByUser;
    mapping (bytes32 => bool) public mUsedPlayerSeeds;

    Payline[] public pt;

    struct Payline {
        uint16 prize;
        uint prob;
    }

    /*function getPT() {
      uint16 prize=0;
      uint prob=0;
      for(uint i=0; i<PaytableStorage(payStorage).getNumofPayline(mMaxPrize, mDecider); i++){
        (prize, prob) = PaytableStorage(payStorage).getPayline(mMaxPrize, mDecider, i);
        pt.push(Payline(prize,prob));

      }
    }*/


    enum GameState {
        INITIALIZED,
        PROVIDERSEEDSET,
        PLAYERSEEDSET,
        PLAYING,
        END
    }

    struct Game {
        GameState gameState;
        address player;
        uint bet;
        bytes32 providerSeed;
        bytes32 playerSeed;
        uint randomNumber;
        bool providerSeedReady;
        bool playerSeedReady;
        uint numofLines;
        uint reward;
    }

    function hi() constant returns (uint) {
        return PaytableStorage(payStorage).getNumofPayline(mMaxPrize,mDecider);
    }

    function hello(uint idx) constant returns (uint16, uint) {
      return PaytableStorage(payStorage).getPayline(mMaxPrize,mDecider,idx);
    }

    mapping (bytes32 => Game) public mGames;
    /*
        MODIFIERS
    */
    modifier onlyAvailable() {
        require(mAvailable);
        _;
    }

    modifier notBankrupt() {
        require(!mBankrupt);
        _;
    }

    modifier notOccupied() {
        require(mPlayer == 0x0);
        _;
    }

    modifier onlyPlayer() {
        require(mPlayer != 0x0 && msg.sender == mPlayer);
        _;
    }

    modifier notPlaying() {
        require(!mIsGamePlaying);
        _;
    }
    /*
        EVENTS
    */
    event playerLeft(address player, uint playerBalance);
    event providerLeft(address provider);

    event gameOccupied(address player, uint playerBalance);
    event providerSeedInitialized(bytes32 _providerSeed);

    event gameInitialized(address player, uint bet, uint lines);
    event providerSeedSet(bytes32 providerSeed);
    event playerSeedSet(bytes32 playerSeed);

    event gameConfirmed(bytes32 gameId, uint reward);

    event invalidEtherSent(address from, uint value);
    event invalidSeed();

    function () payable {
      if (msg.sender == owner || tx.origin == owner) {
        providerBalance += msg.value;
      } else if(msg.sender == mPlayer) {
        playerBalance += msg.value;
      } else {
        invalidEtherSent(msg.sender, msg.value);
      }
    }

    function SlotMachine(address _provider, uint16 _decider, uint _minBet, uint _maxBet, uint16 _maxPrize, address _payStorage)
        payable
    {
        transferOwnership(_provider);

        mDecider = _decider;
        mPlayer = 0x0;
        mAvailable = true;
        mBankrupt = false;
        mMinBet = _minBet;
        mMaxBet = _maxBet;
        mMaxPrize = _maxPrize;
        mIsGamePlaying = false;
        mCurrentGameId = 0x0;

        payStorage = _payStorage;

        providerBalance = msg.value;
        playerBalance = 0;

        previousProviderSeed = 0x0;
        previousPlayerSeed = 0x0;

        initialProviderSeedReady = false;
        initialPlayerSeedReady = false;

        uint16 prize=0;
        uint prob=0;
        for(uint i=0; i<PaytableStorage(payStorage).getNumofPayline(mMaxPrize, mDecider); i++){
          (prize, prob) = PaytableStorage(payStorage).getPayline(mMaxPrize, mDecider, i);
          pt.push(Payline(prize,prob));

        }

    }

    function occupy(bytes32 _playerSeed)
        payable
        onlyAvailable
        notOccupied
    {

        require(msg.sender != owner);

        mPlayer = msg.sender;
        playerBalance += msg.value;

        previousPlayerSeed = _playerSeed;

        initialPlayerSeedReady = true;
        gameOccupied(mPlayer, playerBalance);
    }

    function initProviderSeed(bytes32 _providerSeed)
        onlyOwner
        onlyAvailable
    {
        require(initialPlayerSeedReady);

        previousProviderSeed = _providerSeed;
        initialProviderSeedReady = true;
        providerSeedInitialized(_providerSeed);
    }

    function leave()
        onlyPlayer
    {

        //TODO : initialProviderSeedReady =false;
        msg.sender.transfer(playerBalance);
        playerLeft(mPlayer, playerBalance);
        playerBalance = 0;
        mAvailable = true;
        mBankrupt = false;
        mPlayer = 0x0;
        mIsGamePlaying = false;
        mCurrentGameId = 0x0;
        previousProviderSeed = 0x0;
        previousPlayerSeed = 0x0;
        initialProviderSeedReady = false;
        initialPlayerSeedReady = false;

    }

    function shutDown()

    //    onlyOwner
        notOccupied
        onlyAvailable
        notPlaying
    {
        selfdestruct(owner);
    }

    function initGameforPlayer(uint _bet, uint _lines)
        onlyAvailable
        onlyPlayer
        notBankrupt
        notPlaying
    {
        require(_bet >= mMinBet && _bet <= mMaxBet);
        require(_bet * _lines <= playerBalance);

        if(_bet * _lines > providerBalance) {
            mBankrupt = true;
            throw;
        }
        //TODO : num of line filter

        //TODO : recalculate player balance;
       mGames[previousPlayerSeed] = Game({
           gameState: GameState.INITIALIZED,
           player: mPlayer,
           bet: _bet,
           providerSeed: 0x0,
           playerSeed: 0x0,
           randomNumber: 0,
           playerSeedReady : false,
           providerSeedReady : false,
           numofLines : _lines,
           reward : 0
       });

        playerBalance -= _bet * _lines;
        providerBalance += _bet * _lines;

        mNumGamePlayedByUser[msg.sender]++;
        mIsGamePlaying = true;
        mCurrentGameId = previousPlayerSeed;
        gameInitialized(mPlayer, _bet, _lines);
    }

    function setProviderSeed(bytes32 _providerSeed)
        onlyOwner
        onlyAvailable
    {

        require(mGames[mCurrentGameId].gameState == GameState.INITIALIZED);

        mGames[mCurrentGameId].providerSeed = _providerSeed;
        mGames[mCurrentGameId].gameState = GameState.PROVIDERSEEDSET;
        mGames[mCurrentGameId].providerSeedReady = true;
        providerSeedSet(_providerSeed);
    }



    function setPlayerSeed(bytes32 _playerSeed)
        onlyPlayer
        onlyAvailable
    {

        require(mGames[mCurrentGameId].gameState == GameState.PROVIDERSEEDSET);
        require(!mUsedPlayerSeeds[_playerSeed]);

        mUsedPlayerSeeds[_playerSeed] = true;

        mGames[mCurrentGameId].playerSeed = _playerSeed;
        mGames[mCurrentGameId].gameState = GameState.PLAYERSEEDSET;
        mGames[mCurrentGameId].playerSeedReady = true;
        playerSeedSet(_playerSeed);

        confirmGame();
    }


    function checksha(bytes32 data) constant returns (bytes32) {
      return sha3(data);
    }

    function checkseed() constant returns (bytes32, bytes32) {
        Game game = mGames[mCurrentGameId];
      return (sha3(game.providerSeed), sha3(game.playerSeed));
    }
    function confirmGame()

    {
        require(mIsGamePlaying);


        Game game = mGames[mCurrentGameId];

        require(game.gameState == GameState.PLAYERSEEDSET);
        require(game.playerSeedReady && game.providerSeedReady);

        if(previousProviderSeed != sha3(game.providerSeed) || previousPlayerSeed != sha3(game.playerSeed)) {
            invalidSeed();
            throw;
        }

        uint reward = 0;
        uint factor = 0;
        uint divider = 100000000000;

        bytes32 rnseed = sha3(game.providerSeed ^ game.playerSeed);
        uint randomNumber = uint(rnseed) % divider;
        uint16 prize = 0;
        uint prob = 0;

        /*for(uint j=0; j<game.numofLines; j++){
          factor = 0;
          rnseed = rnseed<<1;
          randomNumber = uint(rnseed) % divider;
          for(uint i=0; i<PaytableStorage(payStorage).getNumofPayline(mMaxPrize, mDecider)-1; i++){
            (prize, prob) = PaytableStorage(payStorage).getPayline(mMaxPrize, mDecider, i);
            if(factor <= randomNumber && randomNumber < factor + prob){
              reward += prize;
              break;
            }
            factor += prob;
          }
        }*/

      for(uint j=0; j<game.numofLines; j++){
          factor = 0;
          rnseed = rnseed<<1;
          randomNumber = uint(rnseed) % divider;
          for(uint i=0; i<pt.length-1; i++){
            if(factor <= randomNumber && randomNumber < factor + pt[i+1].prob){
              reward += pt[i+1].prize;
              break;
            }
            factor += pt[i+1].prob;
          }
        }


        reward = reward * game.bet;

        game.randomNumber = randomNumber;
        game.gameState = GameState.END;
        game.reward = reward;
        // TODO: calculate reward

        providerBalance -= reward;
        playerBalance += reward;

        mIsGamePlaying = false;

        previousProviderSeed = game.providerSeed;
        previousPlayerSeed = game.playerSeed;
        gameConfirmed(mCurrentGameId, reward);

    }

    function getInfo() constant returns (uint, uint, uint) {
        return (mDecider, mMinBet, mMaxBet);
    }
}
