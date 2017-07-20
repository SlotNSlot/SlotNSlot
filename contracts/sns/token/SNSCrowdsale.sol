pragma solidity ^0.4.0;


import './SNSToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';


contract SNSCrowdsale {
    uint public constant STAGE_ONE_TIME_END = 6 hours;

    uint public constant STAGE_TWO_TIME_END = 12 hours;

    uint public constant STAGE_THREE_TIME_END = 1 days;

    uint public constant STAGE_FOUR_TIME_END = 1 weeks;

    uint public constant PRICE_STAGE_ONE = 480000;

    uint public constant PRICE_STAGE_TWO = 440000;

    uint public constant PRICE_STAGE_THREE = 400000;

    uint public constant PRICE_STAGE_FOUR = 360000;

    uint public constant ALLOC_CROWDSALE = 60000000000;

    uint public startTime;

    uint public endTime;

    address public multisigAddress;

    address public ownerAddress;

    SNSToken public plutoToken;

    uint public etherRaised;

    uint public pltSold;

    bool public halted;

    modifier isCrowdfundPeriod() {
        if (now < startTime || now >= endTime) throw;
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != ownerAddress) throw;
        _;
    }

    modifier isNotHalted() {
        if (halted) throw;
        _;
    }

    event Buy(address indexed _recipient, uint _amount);

    function SNSCrowdsale(address _multisigAddr, address _plutoToken, uint _startTime) {
        multisigAddress = _multisigAddr;
        ownerAddress = msg.sender;
        startTime = _startTime;
        endTime = startTime + 1 weeks;

        plutoToken = SNSToken(_plutoToken);
    }

    function toggleHalt(bool _halted)
    onlyOwner
    {
        halted = _halted;
        plutoToken.transferOwnership(msg.sender);
    }


    function transferOwnership(address _newOwner)
    onlyOwner
    {
        if (_newOwner != address(0)) {
            ownerAddress = _newOwner;
        }
    }

    function getPriceRate()
    constant
    returns (uint o_rate)
    {
        if (now <= startTime + STAGE_ONE_TIME_END) return PRICE_STAGE_ONE;
        if (now <= startTime + STAGE_TWO_TIME_END) return PRICE_STAGE_TWO;
        if (now <= startTime + STAGE_THREE_TIME_END) return PRICE_STAGE_THREE;
        if (now <= startTime + STAGE_FOUR_TIME_END) return PRICE_STAGE_FOUR;
        else return 0;
    }

    function processPurchase(uint _rate, uint _remaining)
    internal
    returns (uint o_amount)
    {
        o_amount = SafeMath.div(SafeMath.mul(msg.value, _rate), 1 ether);

        if (o_amount > _remaining) throw;
        if (!multisigAddress.send(msg.value)) throw;
        if (!plutoToken.createToken(msg.sender, o_amount)) throw;

        pltSold += o_amount;
        etherRaised += msg.value;
    }

    function()
    payable
    isCrowdfundPeriod
    isNotHalted
    {
        if (msg.value == 0) {
            throw;
        }

        uint amount = processPurchase(getPriceRate(), ALLOC_CROWDSALE - pltSold);
        Buy(msg.sender, amount);
    }

    function drain()
    onlyOwner
    {
        if(!ownerAddress.send(this.balance)) throw;
    }
}
