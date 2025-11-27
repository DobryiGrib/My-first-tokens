pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptoBank is Ownable{
    constructor() Ownable(msg.sender) {}

    mapping(address => uint256) public balanceOf;

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


}