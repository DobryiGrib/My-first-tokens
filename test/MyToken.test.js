const { expect } = require("chai");

require("@nomicfoundation/hardhat-chai-matchers");

describe("MyERC20Token ERC-20", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyERC20Token");
    token = await MyToken.deploy();
  });

  it("Should have correct initial values", async function () {
    expect(await token.name()).to.equal("My Token");
    expect(await token.symbol()).to.equal("MTK");
    expect(await token.decimals()).to.equal(18n);
  });

  it("Should mint initial supply to owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1000000n * 10n ** 18n);
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, 1000);
    expect(await token.balanceOf(addr1.address)).to.equal(1000n);
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
  let errorThrown = false;
  
  try {
    await token.connect(addr1).transfer(owner.address, 1n);
  } catch (error) {
    errorThrown = true;
    // Проверяем что ошибка связана с revert
    expect(error.message).to.include("reverted");
    expect(error.message).to.include("Insufficient balance");
  }
  
  expect(errorThrown).to.be.true;
});

});
