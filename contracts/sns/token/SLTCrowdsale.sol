pragma solidity ^0.4.0;


import './SLTToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';


contract SLTCrowdsale {

    /*
        The funding goal is 50000 eth originally, but we set this into 100000 eth to prevent unexpected problem.
    */
    uint public constant FUNDING_GOAL = 100000000000000000000000;

    uint public constant FUNDING_PERIOD = 2 weeks;

    uint public constant FUNDING_START_BLOCK_NUM = 560000;

    uint public constant STAGE_ONE_TIME_END = 1 days;

    uint public constant STAGE_TWO_TIME_END = 2 weeks;

    uint public constant PRICE_STAGE_ONE = 12000;

    uint public constant PRICE_STAGE_TWO = 10000;

    uint public constant ALLOC_CROWDSALE = 60000000000;

    uint public startTime;

    uint public endTime;

    address public multisigAddress;

    address public ownerAddress;

    SLTToken public sltToken;

    uint public etherRaised;

    uint public sltSold;

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

    function SNSCrowdsale(address _multisigAddr, address sltToken, uint _startTime) {
        multisigAddress = _multisigAddr;
        ownerAddress = msg.sender;
        startTime = _startTime;
        endTime = startTime + 1 weeks;

        sltToken = SLTToken(sltToken);
    }

    function toggleHalt(bool _halted)
    onlyOwner
    {
        halted = _halted;
        sltToken.transferOwnership(msg.sender);
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
        else return 0;
    }

    function processPurchase(uint _rate, uint _remaining)
    internal
    returns (uint o_amount)
    {
        o_amount = SafeMath.div(SafeMath.mul(msg.value, _rate), 1 ether);

        if (o_amount > _remaining) throw;
        if (!multisigAddress.send(msg.value)) throw;
        if (!sltToken.createToken(msg.sender, o_amount)) throw;

        sltSold += o_amount;
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

        uint amount = processPurchase(getPriceRate(), ALLOC_CROWDSALE - sltSold);
        Buy(msg.sender, amount);
    }

    function drain()
    onlyOwner
    {
        if(!ownerAddress.send(this.balance)) throw;
    }
}
