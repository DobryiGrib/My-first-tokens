const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("cryptoBank", function(){
    let bank;

    beforeEach(async function () {
      const Bank = await ethers.getContractFactory("CryptoBank");
      bank = await Bank.deploy();
      await bank.waitForDeployment();
    });

    it("Must let user to deposit", async function(){
        const [owner, user] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        const tx = await bank.connect(user).deposit({ value: amount });
        await tx.wait();
        const bal = await bank.balanceOf(user.address);
        expect(bal).to.equal(amount);
    })

    it("must let user to withdraw", async function(){
        const [owner, user] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        const tx = await bank.connect(user).deposit({ value: amount });
        await tx.wait();
        const amountWithdraw = ethers.parseEther("0.9");
        const balanceBefore = await bank.balanceOf(user.address);
        const contractBalanceBefore = await ethers.provider.getBalance(bank.target);
        const withdrawTx = await bank.connect(user).withdraw(amountWithdraw);
        const receipt = await withdrawTx.wait();
        const balanceAfter = balanceBefore - amountWithdraw;
        const contractBalanceAfter = await ethers.provider.getBalance(bank.target);
        const contractBalanceExpect = contractBalanceBefore - amountWithdraw;
        expect(await bank.balanceOf(user.address)).to.equal(balanceAfter);
        expect(contractBalanceExpect).to.equal(contractBalanceAfter)
    })

    it("must reject if user try to deposit zero", async function(){
        const [owner, user] = await ethers.getSigners();
         let errorCaught = false;

     try {
        await bank.connect(user).deposit({ value: 0 });
    } catch (error) {
        errorCaught = true;
        // Можно проверить что revert вообще был
        expect(error.message).to.include("revert");
        expect(error.message).to.include("can't deposit zero");
    }

     expect(errorCaught).to.be.true;
       
    })

    it("must revers if user try to withdraw more than he has", async function(){
        let errorCaught = false;
        const [owner, user] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        const errorAmount = ethers.parseEther("2");
        const tx = await bank.connect(user).deposit({ value: amount });
        await tx.wait();
        const balanceBefore = await bank.balanceOf(user.address);
        const contractBalanceBefore = await ethers.provider.getBalance(bank.target);
       try{
         const errorTx = await bank.connect(user).withdraw(errorAmount);
       } catch (error){
        errorCaught = true;
        expect(error.message).to.include("revert");
        expect(error.message).to.include("user doesn't have enough money");
       }

       expect(await bank.balanceOf(user.address)).to.equal(balanceBefore);
       expect(await ethers.provider.getBalance(bank.target)).to.equal(contractBalanceBefore);


    })


})