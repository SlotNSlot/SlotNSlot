pragma solidity ^0.4.0;


import './SLTToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';


contract SLTCrowdsale {

    /*
        The funding goal is 50000 eth originally, but we set this into 100000 eth to prevent unexpected problem.
    */
    uint public constant FUNDING_GOAL = 100000000000000000000000;

    uint public constant FUNDING_PERIOD = 2 weeks;

    uint public constant STAGE_ONE_TIME_END = 1 days;

    uint public constant STAGE_TWO_TIME_END = 2 weeks;

    uint public constant PRICE_STAGE_ONE = 12000;

    uint public constant PRICE_STAGE_TWO = 10000;

    address public mMultisigAddr;

    address public mOwnerAddr;

    SLTToken public mSLTToken;

    uint public mStartTime;

    uint public mEndTime;

    uint public mEtherRaised;

    uint public mSltSold;

    bool public mPaused;

    modifier isCrowdfundPeriod() {
        require(now > mStartTime && now < mEndTime);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == mOwnerAddr);
        _;
    }

    modifier notPaused() {
        require(!mPaused);
        _;
    }

    event Fund(address indexed _recipient, uint _amount);

    function SLTCrowdsale(address _multisigAddr, address _SLTToken, uint _startTime) {
        mMultisigAddr = _multisigAddr;
        mOwnerAddr = msg.sender;

        mStartTime = _startTime;
        mEndTime = mStartTime + FUNDING_PERIOD;

        mSLTToken = SLTToken(_SLTToken);

        mEtherRaised = 0;
        mSltSold = 0;
        mPaused = false;
    }

    function togglePause(bool _paused)
    onlyOwner
    {
        mPaused = _paused;
        mSLTToken.transferOwnership(msg.sender);
    }


    function transferOwnership(address _newOwner)
    onlyOwner
    {
        if (_newOwner != address(0)) {
            mOwnerAddr = _newOwner;
        }
    }

    function getPrice()
    constant
    returns (uint o_rate)
    {
        if (now <= mStartTime + STAGE_ONE_TIME_END) return PRICE_STAGE_ONE;
        if (now <= mStartTime + STAGE_TWO_TIME_END) return PRICE_STAGE_TWO;
        else return 0;
    }

    function processPurchase(uint _rate)
    internal
    returns (uint o_amount)
    {
        o_amount = SafeMath.div(SafeMath.mul(msg.value, _rate), 1 ether);

        mMultisigAddr.transfer(msg.value);
        assert(mSLTToken.createIlliquidToken(msg.sender, o_amount));

        mSltSold += o_amount;
        mEtherRaised += msg.value;
    }

    function()
    payable
    isCrowdfundPeriod
    notPaused
    {
        require(msg.value != 0);

        uint amount = processPurchase(getPrice());
        Fund(msg.sender, amount);
    }

    function drain()
    onlyOwner
    {
        mOwnerAddr.transfer(this.balance);
    }
}
