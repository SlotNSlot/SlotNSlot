pragma solidity ^0.4.0;

import '../zeppelin/ownership/Ownable.sol';

contract SlotMachine is Ownable {

    bool public mAvailable;
    bool public mBankrupt;
    address public mPlayer;
    uint public mDecider;
    uint public mMinBet;
    uint public mMaxBet;

    bool public mIsGamePlaying;
    bytes32 public mCurrentGameId;

    mapping (address => uint) public mNumGamePlayedByUser;
    mapping (bytes32 => bool) public mUsedPlayerSeeds;

    enum GameState {
        PLAYING,
        END
    }

    struct Game {
        GameState gameState;
        address player;
        uint bet;
        bytes32 providerSeed;
        uint providerNumber;
        bytes32 playerSeed;
        uint playerNumber;
        uint randomNumber;
    }

    mapping (bytes32 => Game) public mGames;

    /*
        MODIFIERS
    */
    modifier onlyAvailable() {
        if(!mAvailable) throw;
        _;
    }

    modifier notBankrupt() {
        if(mBankrupt) throw;
        _;
    }

    modifier notOccupied() {
        if(mPlayer != 0x0) throw;
        _;
    }

    modifier onlyPlayer() {
        if(mPlayer == 0x0 || msg.sender != mPlayer) throw;
        _;
    }

    modifier notPlaying() {
        if(!mIsGamePlaying) throw;
        _;
    }

    /*
        EVENTS
    */
    event gameInitialized(bytes32 gameId);
    event gameConfirmed(bytes32 gameId);


    function SlotMachine(address _provider, uint _decider, uint _minBet, uint _maxBet) {
        transferOwnership(_provider);
        mDecider = _decider;
        mPlayer = 0x0;
        mAvailable = true;
        mBankrupt = false;
        mMinBet = _minBet;
        mMaxBet = _maxBet;

        mIsGamePlaying = false;
    }

    function occupy()
        onlyAvailable
        notOccupied
    {
        mPlayer = msg.sender;
    }

    function leave()
        onlyPlayer
    {
        mPlayer = 0x0;
    }

    function shutDown()
        onlyOwner
        onlyAvailable
        notPlaying
    {
        mAvailable = false;
        owner.transfer(this.balance);
    }

    function initGame(bytes32 _providerSeed, bytes32 _playerSeed)
        payable
        onlyAvailable
        onlyPlayer
        notBankrupt
        notPlaying
    {
        uint bet = msg.value;
        if(bet > mMaxBet || bet < mMinBet) {
            throw;
        }

        // TODO: What is the maximum reward of this machine?
        if(bet > this.balance) {
            mBankrupt = true;
            throw;
        }

        bytes32 playerSeed = _playerSeed;
        if(mUsedPlayerSeeds[playerSeed]) {
            throw;
        }
        mUsedPlayerSeeds[playerSeed] = true;

        mGames[playerSeed] = Game({
            gameState: GameState.PLAYING,
            player: mPlayer,
            bet: bet,
            providerSeed: _providerSeed,
            providerNumber: 0,
            playerSeed: _playerSeed,
            playerNumber: 0,
            randomNumber: 0
        });
        mNumGamePlayedByUser[msg.sender]++;
        mIsGamePlaying = true;
        mCurrentGameId = playerSeed;

        gameInitialized(playerSeed);
    }

    function confirmGame(uint _providerNumber, uint _playerNumber)
        onlyPlayer
        notBankrupt
    {
        if(!mIsGamePlaying) {
            throw;
        }

        Game game = mGames[mCurrentGameId];
        if(game.gameState != GameState.PLAYING) {
            throw;
        }

        if(sha3(_providerNumber) != game.providerSeed || sha3(_playerNumber) != game.playerSeed) {
            throw;
        }

        uint randomNumber = uint(sha3(_providerNumber ^ _playerNumber));
        game.providerNumber = _providerNumber;
        game.playerNumber = _playerNumber;
        game.randomNumber = randomNumber;
        game.gameState = GameState.END;

        // TODO: calculate reward

        gameConfirmed(mCurrentGameId);
        mIsGamePlaying = false;
    }

    function getCount(address _player) returns (uint) {
        return mNumGamePlayedByUser[_player];
    }

    function getInfo() constant returns (uint, uint, uint) {
        return (mDecider, mMinBet, mMaxBet);
    }
}
