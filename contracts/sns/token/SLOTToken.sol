pragma solidity ^0.4.0;


import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import 'zeppelin-solidity/contracts/token/ERC20.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title SLOTToken
 */
contract SLOTToken is ERC20, Ownable {
    using SafeMath for uint256;

    string public constant name = 'SlotNSlot';

    string public constant symbol = 'SLOT';

    uint public constant decimals = 18;

    /**
     * SLOT transfer will be locked until the crowd sale ends.
     * After crowd sale ends, SLOT exceeding LOCKUP_LIMIT_AMOUNT will be locked for 100 days.
     */
    uint256 public constant LOCKUP_LIMIT_AMOUNT = 10000000000000000000000000;

    uint256 public constant LOCKUP_PERIOD = 100 days;

    bool public mMintingFinished;

    uint256 public mCrowdsaleEndTime;

    uint256 public mLockEndTime;

    mapping (address => mapping (address => uint256)) allowed;
    mapping (address => uint256) balances;
    mapping (address => uint256) liquidBalances;

    /*
     *  Events
     */
    event Mint(address indexed to, uint256 amount);
    event MintFinished();

    /*
     *  Modifiers
     */
    modifier mintingNotFinished() {
        require(!mMintingFinished);
        _;
    }

    modifier afterCrowdsale() {
        require(now > mCrowdsaleEndTime);
        _;
    }

    /*
     * @dev constructor of SLOT Token
     */
    function SLOTToken(address _minter, uint256 _crowdsaleEndTime) {
        owner = _minter;
        mCrowdsaleEndTime = _crowdsaleEndTime;
        mLockEndTime = mCrowdsaleEndTime + LOCKUP_PERIOD;

        mMintingFinished = false;
    }

    /**
     * @dev transfer token for a specified address
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _to, uint256 _value)
    afterCrowdsale
    returns (bool)
    {
        if(now < mLockEndTime) {
            transferLiquidBalances(msg.sender, _to, _value);
        }

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the the balance of.
     * @return An uint256 representing the amount owned by the passed address.
     */
    function balanceOf(address _owner)
    constant
    returns (uint256 balance)
    {
        return balances[_owner];
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amout of tokens to be transfered
     */
    function transferFrom(address _from, address _to, uint256 _value)
    afterCrowdsale
    returns (bool)
    {
        if(now < mLockEndTime) {
            increaseLiquidBalance(_to, _value);
        }

        var _allowance = allowed[_from][msg.sender];

        // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
        // require (_value <= _allowance);

        allowed[_from][msg.sender] = _allowance.sub(_value);
        balances[_to] = balances[_to].add(_value);
        balances[_from] = balances[_from].sub(_value);

        Transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Aprove the passed address to spend the specified amount of tokens on behalf of msg.sender.
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
    function approve(address _spender, uint256 _value)
    afterCrowdsale
    returns (bool)
    {
        // To change the approve amount you first have to reduce the addresses`
        //  allowance to zero by calling `approve(_spender, 0)` if it is not
        //  already 0 to mitigate the race condition described here:
        //  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
        require((_value == 0) || (allowed[msg.sender][_spender] == 0));

        if(now < mLockEndTime) {
            uint256 allowedOriginal = allowed[msg.sender][_spender];
            if (_value == 0) {
                increaseLiquidBalance(msg.sender, allowedOriginal);
            } else {
                decreaseLiquidBalance(msg.sender, _value);
            }
        }

        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param _owner address The address which owns the funds.
     * @param _spender address The address which will spend the funds.
     * @return A uint256 specifing the amount of tokens still avaible for the spender.
     */
    function allowance(address _owner, address _spender)
    constant
    returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Function to mint tokens
     * @param _to The address that will recieve the minted tokens.
     * @param _amount The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     * Based on code by Zeppelin MintableToken
     */
    function mint(address _to, uint256 _amount)
    onlyOwner
    mintingNotFinished
    returns (bool)
    {
        totalSupply = totalSupply.add(_amount);
        balances[_to] = balances[_to].add(_amount);

        increaseLiquidBalance(_to, _amount);

        Mint(_to, _amount);
        return true;
    }

    /**
     * @dev Function to stop minting new tokens.
     * @return True if the operation was successful.
     * Based on code by Zeppelin MintableToken
     */
    function finishMinting()
    onlyOwner
    returns (bool) {
        mMintingFinished = true;
        MintFinished();

        return true;
    }

    /**
     * @dev Gets the liquid balance of the specified address.
     * @param _owner The address to query the liquid balance of.
     * @return An uint256 representing the amount owned by the passed address.
     */
    function liquidBalanceOf(address _owner)
    constant
    returns (uint256 liquidBalance)
    {
        return liquidBalances[_owner];
    }

    /**
     *  Internals
     */

    /**
     * @dev Transfer liquid balances of specified addresses.
     * @param _from The address to decrease the liquid balance of.
     * @param _to The address to increase the liquid balance of.
     * @param _value The amount of liquid balance to be transferred.
     */
    function transferLiquidBalances(address _from, address _to, uint256 _value)
    internal
    {
        decreaseLiquidBalance(_from, _value);
        increaseLiquidBalance(_to, _value);
    }

    function decreaseLiquidBalance(address _target, uint256 _value)
    internal
    {
        liquidBalances[_target] = liquidBalances[_target].sub(_value);
    }

    function increaseLiquidBalance(address _target, uint256 _value)
    internal
    {
        if (liquidBalances[_target].add(_value) > LOCKUP_LIMIT_AMOUNT) {
            liquidBalances[_target] = LOCKUP_LIMIT_AMOUNT;
        } else {
            liquidBalances[_target] = liquidBalances[_target].add(_value);
        }
    }
}
