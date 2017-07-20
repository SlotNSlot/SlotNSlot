pragma solidity ^0.4.0;

import "../OraclizeAPI.sol";
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract SlotMachineOraclize is usingOraclize, Ownable {

    bool public mAvailable;
    address public mPlayer;
    uint public mMinBet;
    uint public mMaxBet;
    bool public mIsGamePlaying;

    enum GameState {
        FETCHING,
        END
    }

    struct Game {
        GameState gameState;
        address player;
        uint bet;
        uint randomNumber;
    }

    Game[] mGames;

    event newRandomNumberFetched(uint);

    function SlotMachineOraclize(address _provider, uint _minBet, uint _maxBet) {
        oraclize_setProof(proofType_Ledger);

        transferOwnership(_provider);
        mPlayer = 0x0;
        mAvailable = true;
        mMinBet = _minBet;
        mMaxBet = _maxBet;

        mIsGamePlaying = false;
    }

    function __callback(bytes32 _queryId, string _result, bytes _proof)
    oraclize_randomDS_proofVerify(_queryId, _result, _proof)
    {
        if (msg.sender != oraclize_cbAddress()) throw;
        uint result;
        assembly { result := mload(_result) }

        newRandomNumberFetched(result);

        // TODO: check game result and save it
    }

    function bytesToUint(bytes _bytes) returns (uint result)
    {
        assembly {
            result := mload(_bytes)
        }
    }

    function pull() {
        uint N = 32;
        uint delay = 0;
        uint callbackGas = 200000;
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas);
    }
}
