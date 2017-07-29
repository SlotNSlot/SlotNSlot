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

    bool betReady;
    bool playerSeedReady;
    bool providerSeedReady;

    uint public providerBalance;
    uint public playerBalance;

    bytes32 public previousPlayerSeed;
    bytes32 public previousProviderSeed;

    bool public initialPlayerSeedReady;
    bool public initialProviderSeedReady;

    uint[2] public payTable;
    uint8 public numOfPayLine;

    struct Game {
        uint bet;
        bytes32 providerSeed;
        bytes32 playerSeed;
        uint randomNumber;
        bool providerSeedReady;
        bool playerSeedReady;
        uint numofLines;
        uint reward;
    }

    Game public mGame;
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

    event gameOccupied(address player, bytes32 playerSeed);
    event providerSeedInitialized(bytes32 providerSeed);

    event gameInitialized(address player, uint bet, uint lines);
    event providerSeedSet(bytes32 providerSeed);
    event playerSeedSet(bytes32 playerSeed);

    event gameConfirmed(uint reward);

    function () payable {
      if (msg.sender == owner || tx.origin == owner) {
        providerBalance += msg.value;
      } else if(msg.sender == mPlayer) {
        playerBalance += msg.value;
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

        mGame.bet = 0;
        mGame.providerSeed = 0;
        mGame.playerSeed = 0;
        mGame.randomNumber = 0;
        mGame.playerSeedReady = false;
        mGame.providerSeedReady = false;
        mGame.numofLines = 1;
        mGame.reward = 1;

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

        payTable = PaytableStorage(payStorage).getPayline(mMaxPrize,mDecider);
        numOfPayLine = PaytableStorage(payStorage).getNumofPayline(mMaxPrize,mDecider);

    }

    function occupy(bytes32 _playerSeed)
        payable
        onlyAvailable
        notOccupied
    {

        require(msg.sender != owner);

        mPlayer = msg.sender;
        playerBalance += msg.value;
        mAvailable = false;

        previousPlayerSeed = _playerSeed;

        initialPlayerSeedReady = true;
        gameOccupied(mPlayer, _playerSeed);
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

        msg.sender.transfer(playerBalance);
        playerLeft(mPlayer, playerBalance);
        playerBalance = 0;
        mAvailable = true;
        mBankrupt = false;
        mPlayer = 0x0;
        mIsGamePlaying = false;
        previousProviderSeed = 0x0;
        previousPlayerSeed = 0x0;
        initialProviderSeedReady = false;
        initialPlayerSeedReady = false;

    }

    function shutDown()
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
    {
        require(_bet >= mMinBet && _bet <= mMaxBet);
        require(_bet * _lines <= playerBalance);

        if(_bet * _lines > providerBalance) {
            mBankrupt = true;
            throw;
        }

        mGame.numofLines = _lines;
        mGame.bet = _bet;

        playerBalance -= _bet * _lines;
        providerBalance += _bet * _lines;

        betReady = true;
        gameInitialized(mPlayer, _bet, _lines);

        if (betReady && providerSeedReady && playerSeedReady){
          confirmGame();
        }

    }

    function setProviderSeed(bytes32 _providerSeed)
        onlyOwner
        onlyAvailable
    {

        mGame.providerSeed = _providerSeed;
        mGame.providerSeedReady = true;
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
        mGame.playerSeed = _playerSeed;
        mGame.playerSeedReady = true;
        playerSeedReady = true;
        playerSeedSet(_playerSeed);

        if (betReady && providerSeedReady && playerSeedReady){
          confirmGame();
        }
    }


    function getPayline(uint8 _idx, uint8 _indicator) constant returns (uint) {
        uint targetPayline;
        uint8 ptr = (_idx <= 6) ? 0 : 1;
        targetPayline = payTable[ptr];

        uint8 leftwalker = (_idx <= 6) ? (_idx * 42) : ((_idx - 6) * 42);
        uint8 rightwalker = (-_indicator + 2) * 31;
        uint8 additionalwalker = ((_idx - 6 * ptr) - 1) * 42 + (_indicator - 1) * 11;

        return (targetPayline << (256 - leftwalker + rightwalker)) >> (256 - leftwalker + rightwalker + additionalwalker);

  	}

    function confirmGame()
    {
        if(previousProviderSeed != sha3(mGame.providerSeed) || previousPlayerSeed != sha3(mGame.playerSeed)) {
            return;
        }
        uint reward = 0;
        uint factor = 0;
        uint divider = 10000000000;
        bytes32 rnseed = sha3(mGame.providerSeed ^ mGame.playerSeed);
        uint randomNumber = uint(rnseed) % divider;

        for(uint j=0; j<mGame.numofLines; j++){
          factor = 0;
          rnseed = rnseed<<1;
          randomNumber = uint(rnseed) % divider;
          for(uint8 i=1; i<numOfPayLine; i++){
            if(factor <= randomNumber && randomNumber < factor + getPayline(i,2)){
              reward += getPayline(i,1);
              break;
            }
            factor += getPayline(i,2);
          }
        }
        reward = reward * mGame.bet;

        mGame.randomNumber = randomNumber;
        mGame.reward = reward;

        providerBalance -= reward;
        playerBalance += reward;

        previousProviderSeed = mGame.providerSeed;
        previousPlayerSeed = mGame.playerSeed;
        gameConfirmed(reward);

        betReady = false;
        providerSeedReady = false;
        playerSeedReady = false;

    }

    function getInfo() constant returns (uint, uint, uint) {
        return (mDecider, mMinBet, mMaxBet);
    }
}
