pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC721Token is ERC721, Ownable{

    uint256 private _nextTokenId = 1;

    constructor() ERC721("First Token", "FTK") Ownable(msg.sender) {}

    function _getNextTokenId() private returns(uint256){
      uint256 tokenId = _nextTokenId;
      _nextTokenId++;
      return tokenId;
    }

    function mint(address _to) public onlyOwner{
      uint256 newItemId = _getNextTokenId();
          _mint(_to, newItemId);
        }
}
