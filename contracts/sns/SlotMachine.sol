pragma solidity ^0.4.0;

import '../zeppelin/ownership/Ownable.sol';

contract SlotMachine is Ownable {
    bool public mAvailable;
    bool public mBankrupt;
    address public mPlayer;
    uint public mDecider;
    uint public mMinBet;
    uint public mMaxBet;
    uint public mMaxPrize;

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
    mapping (uint => mapping (uint => Payline[])) private payTable;


    enum GameState {
        CREATED,
        INITIALIZED,
        PROVIDERSEEDSET,
        PLAYERSEEDSET,
        PLAYING,
        END
    }

    struct Payline {
        uint prize;
        uint prob;
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
        bool playerSeedReady;
        bool providerSeedReady;
        uint numofLines;
        uint reward;
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
        if(mIsGamePlaying) throw;
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

    function () payable {
      if (msg.sender == owner || tx.origin == owner) {
        providerBalance += msg.value;
      } else if(msg.sender == mPlayer) {
        playerBalance += msg.value;
      } else {
        invalidEtherSent(msg.sender, msg.value);
        //throw;
      }
    }

    function setProviderBalance(uint _value) {
      if(tx.origin == owner) providerBalance = _value;
    }

    function SlotMachine(address _provider, uint _decider, uint _minBet, uint _maxBet, uint _maxPrize)
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

        providerBalance = msg.value;
        playerBalance = 0;

        previousProviderSeed = 0x0;
        previousPlayerSeed = 0x0;

        initialProviderSeedReady = false;
        initialPlayerSeedReady = true;

        /*payTable[1000][100].push(Payline(0,0));
        payTable[1000][100].push(Payline(5,12118000000));
        payTable[1000][100].push(Payline(10,2468400000));
        payTable[1000][100].push(Payline(25,301250000));
        payTable[1000][100].push(Payline(50,61363000));
        payTable[1000][100].push(Payline(75,24193000));
        payTable[1000][100].push(Payline(100,12499000));
        payTable[1000][100].push(Payline(125,7489000));
        payTable[1000][100].push(Payline(150,4927900));
        payTable[1000][100].push(Payline(250,1525500));
        payTable[1000][100].push(Payline(500,310730));
        payTable[1000][100].push(Payline(1000,63293));
        payTable[1000][100].push(Payline(1500,24954));

        payTable[1000][125].push(Payline(0,0));
        payTable[1000][125].push(Payline(5,12118000000));
        payTable[1000][125].push(Payline(10,2468400000));
        payTable[1000][125].push(Payline(25,301250000));
        payTable[1000][125].push(Payline(50,61363000));
        payTable[1000][125].push(Payline(75,24193000));
        payTable[1000][125].push(Payline(100,12499000));
        payTable[1000][125].push(Payline(125,7489000));
        payTable[1000][125].push(Payline(150,4927900));
        payTable[1000][125].push(Payline(250,1525500));
        payTable[1000][125].push(Payline(500,310730));
        payTable[1000][125].push(Payline(1000,63293));
        payTable[1000][125].push(Payline(1500,24954));*/

        payTable[1000][150].push(Payline(0,0));
        payTable[1000][150].push(Payline(5,12118000000));
        payTable[1000][150].push(Payline(10,2468400000));
        payTable[1000][150].push(Payline(25,301250000));
        payTable[1000][150].push(Payline(50,61363000));
        payTable[1000][150].push(Payline(75,24193000));
        payTable[1000][150].push(Payline(100,12499000));
        payTable[1000][150].push(Payline(125,7489000));
        payTable[1000][150].push(Payline(150,4927900));
        payTable[1000][150].push(Payline(250,1525500));
        payTable[1000][150].push(Payline(500,310730));
        payTable[1000][150].push(Payline(1000,63293));
        payTable[1000][150].push(Payline(1500,24954));

    }

    function occupy(bytes32 _playerSeed)
        payable
        onlyAvailable
        notOccupied
    {
        //TODO : send ether to this contract
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
        /*if(initialProviderSeedReady) {
          throw;
        }*/

        previousProviderSeed = _providerSeed;
        initialProviderSeedReady = true;
        providerSeedInitialized(_providerSeed);
    }

    function leave()
        onlyPlayer
    {
        //TODO : send remaining balance of user
        //TODO : trigger event
        msg.sender.transfer(playerBalance);
        playerLeft(mPlayer, playerBalance);
        playerBalance = 0;
        mPlayer = 0x0;
    }

    function shutDown()
    //    onlyOwner
        notOccupied
        onlyAvailable
        notPlaying
    {
        if (tx.origin != owner) {
          throw;
        }
        /*mAvailable = false;
        owner.transfer(this.balance);
        providerLeft(owner);
        providerBalance = 0;*/
        selfdestruct(owner);

    }

    function initGameforPlayer(uint _bet, uint _lines)
        onlyAvailable
        onlyPlayer
        notBankrupt
        notPlaying
    {
        uint bet = _bet;
        if(bet > mMaxBet || bet < mMinBet) {
            throw;
        }

        if(bet > this.balance) {
            mBankrupt = true;
            throw;
        }
        //TODO : num of line filter

        //TODO : recalculate player balance;
       mGames[previousPlayerSeed] = Game({
           gameState: GameState.INITIALIZED,
           player: mPlayer,
           bet: bet,
           providerSeed: 0x0,
           providerNumber: 0,
           playerSeed: 0x0,
           playerNumber: 0,
           randomNumber: 0,
           playerSeedReady : false,
           providerSeedReady : false,
           numofLines : _lines,
           reward : 0
       });

        playerBalance -= bet * _lines;
        providerBalance += bet * _lines;

        mNumGamePlayedByUser[msg.sender]++;
        mIsGamePlaying = true;
        mCurrentGameId = previousPlayerSeed;
        gameInitialized(mPlayer, bet, _lines);
    }

    function setProviderSeed(bytes32 _providerSeed)
        onlyOwner
        onlyAvailable
    {

        if(mGames[mCurrentGameId].gameState != GameState.INITIALIZED) {
            throw;
        }

        mGames[mCurrentGameId].providerSeed = _providerSeed;
        mGames[mCurrentGameId].gameState = GameState.PROVIDERSEEDSET;
        mGames[mCurrentGameId].providerSeedReady = true;
        providerSeedSet(_providerSeed);
    }



    function setPlayerSeed(bytes32 _playerSeed)
        onlyPlayer
        onlyAvailable
        returns (uint)
    {
        if(mGames[mCurrentGameId].gameState != GameState.PROVIDERSEEDSET) {
            throw;
        }

        bytes32 playerSeed = _playerSeed;
        if(mUsedPlayerSeeds[playerSeed]) {
            throw;
        }

        mUsedPlayerSeeds[playerSeed] = true;

        mGames[mCurrentGameId].playerSeed = _playerSeed;
        mGames[mCurrentGameId].gameState = GameState.PLAYERSEEDSET;
        mGames[mCurrentGameId].playerSeedReady = true;
        playerSeedSet(playerSeed);

        return confirmGame();
    }

    function confirmGame()
      returns (uint)
    {
        if(!mIsGamePlaying) {
            throw;
        }

        Game game = mGames[mCurrentGameId];
        if(game.gameState != GameState.PLAYERSEEDSET) {
            throw;
        }

        /*if(previousProviderSeed != sha3(game.providerSeed) || previousPlayerSeed != sha3(game.playerSeed)) {
            throw;
        }*/

        uint reward = 0;
        uint factor = 0;
        uint divider = 100000000000;
        bytes32 rnseed = sha3(game.providerSeed ^ game.playerSeed);
        uint randomNumber = uint(rnseed) % divider;
        uint prize = mMaxPrize;
        uint prob = mDecider;

        for(uint j=0; j<game.numofLines; j++){
          factor = 0;
          rnseed = rnseed<<1;
          randomNumber = uint(rnseed) % divider;
          for(uint i=0;i<payTable[prize][prob].length-1;i++){
            if(factor <= randomNumber && randomNumber < factor + payTable[prize][prob][i+1].prob){
              reward += payTable[prize][prob][i+1].prize;
            }
            factor += payTable[prize][prob][i+1].prob;
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

        return reward;
    }


    function getCount(address _player) returns (uint) {
        return mNumGamePlayedByUser[_player];
    }

    function getInfo() constant returns (uint, uint, uint) {
        return (mDecider, mMinBet, mMaxBet);
    }
}
