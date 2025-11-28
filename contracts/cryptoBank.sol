pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBank is Ownable{
    constructor() Ownable(msg.sender) {}

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function deposit() public payable{
        require(msg.value > 0, "can't deposit zero");
        balanceOf[msg.sender] += msg.value;
        emit Transfer(msg.sender, address(this), msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(balanceOf[msg.sender] >= _amount, "user doesn't have enough money");
        balanceOf[msg.sender] -= _amount;
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "ETH transfer failed");
        emit Transfer(address(this), msg.sender, _amount);
    }

    function approve(address _spender, uint256 _amount) public returns(bool) {
        require(_spender != address(0), "Incorrect address entered");
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }
 
    function transferFrom(address _from, address _to, uint256 _amount) public {
        require(_to != address(0), "Incorrect address entered");
        require(balanceOf[_from] >= _amount, "user doesn't have enough money");
        require(allowance[_from][msg.sender] >= _amount, "user doesn't have enough allowed money");
        balanceOf[_from] -= _amount;
        balanceOf[_to] += _amount;
        allowance[_from][msg.sender] -= _amount;
        emit Transfer(_from, _to, _amount);
        emit Approval(_from, msg.sender, allowance[_from][msg.sender]);
    }

    function transfer(address _to, uint256 _amount) public {
        require(_to != address(0), "Incorrect address entered");
        require(balanceOf[msg.sender] >= _amount, "user doesn't have enough money");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
        emit Transfer(msg.sender, _to, _amount);
    }

    function increaseAllowance (address _spender, uint256 _addedValue) public {
        require(_spender != address(0), "Incorrect address entered");
        allowance[msg.sender][_spender] += _addedValue;
        emit Approval(msg.sender, _spender, allowance[msg.sender][_spender]);
    }

    function decreaseAllowance(address _spender, uint256 _subValue) public {
        require(_spender != address(0), "Incorrect address entered");
        require(allowance[msg.sender][_spender] >= _subValue, "value to subtraction is more than user has");
        allowance[msg.sender][_spender] -= _subValue;
        emit Approval(msg.sender, _spender, allowance[msg.sender][_spender]);
    }

    function balanceOfBank() public view returns(uint256){
        return address(this).balance;
    }



}