pragma solidity ^0.8.30;

contract MyERC20Token{

    string public name = "My Token";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;

    constructor() {
    balanceOf[msg.sender] = totalSupply;
    emit Transfer(address(0), msg.sender, totalSupply);
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowedAddress;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function transfer(address _to, uint256 _amount) public {
        require(_amount > uint256(0), "there are no amount");
        require(_to != address(0), "can't transfer to zero address");
        require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
    }

    function approve(address _spender, uint256 _amount) external {
         require(_amount == 0 || allowedAddress[msg.sender][_spender] == 0, "Set allowance to zero first"); 
        allowedAddress[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) external {
         require(_to != address(0), "can't transfer to zero address");
        require(balanceOf[_from] >= _amount, "Insufficient balance");
        require(allowedAddress[_from][msg.sender] >= _amount, "Error on allowedAddress");
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowedAddress[_from][msg.sender] -= _amount;

        emit Transfer(_from, _to, _amount);

    }


}