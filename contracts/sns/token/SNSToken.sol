pragma solidity ^0.4.0;


import 'zeppelin-solidity/contracts/token/MintableToken.sol';


contract SNSToken is MintableToken {

    string public constant name = 'SNSToken';

    string public constant symbol = 'SNS';

    uint public constant decimals = 18;

    uint public constant LOCKOUT_PERIOD = 1 hours;

    mapping (address => uint) public illiquidBalance;

    uint public endMintingTime;

    modifier whenThrowable {
        if (now < endMintingTime + LOCKOUT_PERIOD) throw;
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
