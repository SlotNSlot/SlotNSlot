pragma solidity ^0.4.0;


import 'zeppelin-solidity/contracts/token/MintableToken.sol';


contract SLTToken is MintableToken {

    string public constant name = 'SlotNSlot';

    string public constant symbol = 'SLT';

    uint public constant decimals = 18;

    uint public constant MINTING_PERIOD = 2 weeks;

    mapping (address => uint) public illiquidBalance;

    uint public endMintingTime;

    modifier whenThrowable {
        if (now < endMintingTime) throw;
        _;
    }

    modifier whenMintable() {
        if (now >= endMintingTime) throw;
        _;
    }

    function SNSToken(address _minter, uint _endMintingTime) {
        owner = _minter;
        endMintingTime = _endMintingTime;
    }

    function createToken(address _recipient, uint _value)
    whenMintable
    onlyOwner
    returns (bool o_success)
    {
        balances[_recipient] = balances[_recipient].add(_value);
        return true;
    }

    function createIlliquidToken(address _recipient, uint _value)
    whenMintable
    onlyOwner
    returns (bool o_success)
    {
        illiquidBalance[_recipient] += _value;
        return true;
    }

    function makeLiquid()
    whenThrowable
    {
        balances[msg.sender] += illiquidBalance[msg.sender];
        illiquidBalance[msg.sender] = 0;
    }
}
