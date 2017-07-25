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

    bool betReady;
    bool playerSeedReady;
    bool providerSeedReady;

    uint public providerBalance;
    uint public playerBalance;

    bytes32 public previousPlayerSeed;
    bytes32 public previousProviderSeed;

    bool public initialPlayerSeedReady;
    bool public initialProviderSeedReady;


    uint[2] public pt;
    uint8 public numPayline;


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

        betReady = false;
        providerSeedReady = false;
        playerSeedReady = false;

        previousProviderSeed = 0x0;
        previousPlayerSeed = 0x0;

        initialProviderSeedReady = false;
        initialPlayerSeedReady = false;


        pt = PaytableStorage(payStorage).getPayline(mMaxPrize,mDecider);
        numPayline = 11;

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
        betReady = true;

        mIsGamePlaying = true;
        mCurrentGameId = previousPlayerSeed;
        gameInitialized(mPlayer, _bet, _lines);

        if (betReady && providerSeedReady && playerSeedReady){
          confirmGame();
        }
    }

    function setProviderSeed(bytes32 _providerSeed)
        onlyOwner
        onlyAvailable
    {

        mGames[mCurrentGameId].providerSeed = _providerSeed;
        mGames[mCurrentGameId].gameState = GameState.PROVIDERSEEDSET;
        mGames[mCurrentGameId].providerSeedReady = true;
        providerSeedReady = true;
        providerSeedSet(_providerSeed);

        if (betReady && providerSeedReady && playerSeedReady){
          confirmGame();
        }

    }



    function setPlayerSeed(bytes32 _playerSeed)
        onlyPlayer
        onlyAvailable
    {

        mGames[mCurrentGameId].playerSeed = _playerSeed;
        mGames[mCurrentGameId].gameState = GameState.PLAYERSEEDSET;
        mGames[mCurrentGameId].playerSeedReady = true;
        playerSeedReady = true;

        playerSeedSet(_playerSeed);

        if (betReady && providerSeedReady && playerSeedReady){
          confirmGame();
        }
    }


    function checksha(bytes32 data) constant returns (bytes32) {
      return sha3(data);
    }

    function getPayline(uint8 i,uint8 y) constant returns (uint) {
  		uint paypay;
  		if (i <= 6){
  			paypay = pt[0];
  			return (paypay<<(256-i*42+(-y+2)*31))>>(256-i*42+(-y+2)*31+(i-1)*42 + (y-1)*11);
  		}
  		else {
  			paypay = pt[1];
  			return (paypay<<(256-(i-6)*42+(-y+2)*31))>>(256-(i-6)*42+(-y+2)*31+((i-6)-1)*42 + (y-1)*11);
  		}
  	}

    function confirmGame()

    {
        require(mIsGamePlaying);


        Game game = mGames[mCurrentGameId];

        if(previousProviderSeed != sha3(game.providerSeed) || previousPlayerSeed != sha3(game.playerSeed)) {
            invalidSeed();
            throw;
        }


        uint reward = 0;
        uint factor = 0;
        uint divider = 10000000000;

        bytes32 rnseed = sha3(game.providerSeed ^ game.playerSeed);
        uint randomNumber = uint(rnseed) % divider;
        uint16 prize = 0;
        uint prob = 0;

        for(uint j=0; j<game.numofLines; j++){
          factor = 0;
          rnseed = rnseed<<1;
          randomNumber = uint(rnseed) % divider;
          for(uint8 i=1; i<numPayline; i++){
            if(factor <= randomNumber && randomNumber < factor + getPayline(i,2)){
              reward += getPayline(i,1);
              break;
            }
            factor += getPayline(i,2);
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

        betReady = false;
        providerSeedReady = false;
        playerSeedReady = false;

    }

    function getInfo() constant returns (uint, uint, uint) {
        return (mDecider, mMinBet, mMaxBet);
    }
}
