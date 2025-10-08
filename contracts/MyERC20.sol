pragma solidity ^0.8.30;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MyERC20Token is Pausable, Ownable{

    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;

    constructor() Ownable(msg.sender) {
    balanceOf[msg.sender] = totalSupply;
    emit Transfer(address(0), msg.sender, totalSupply);
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowedAddress;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

     function  pause() external onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() external onlyOwner whenPaused {
        _unpause();
    }

    function transfer(address _to, uint256 _amount) public whenNotPaused returns(bool) {
        require(_amount > uint256(0), "there are no amount");
        require(_to != address(0), "can't transfer to zero address");
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function mint(address _to, uint256 _amount) external onlyOwner whenNotPaused {
        require(_to != address(0), "can't mint to zero address");
        balanceOf[_to] += _amount;
        totalSupply += _amount; 
     emit Transfer(address(0), _to, _amount);
    }
    
    function approve(address _spender, uint256 _amount) external whenNotPaused returns(bool) {
        allowedAddress[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) external whenNotPaused returns(bool) {
         require(_to != address(0), "can't transfer to zero address");
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        require(allowedAddress[_from][msg.sender] >= _amount, "Error on allowedAddress");
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowedAddress[_from][msg.sender] -= _amount;

        emit Transfer(_from, _to, _amount);
        return true;

    }


}


   
