const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("cryptoBank", function(){
    let bank;

    beforeEach(async function () {
      const Bank = await ethers.getContractFactory("CryptoBank");
      bank = await Bank.deploy();
      await bank.waitForDeployment();
    });
    // deposit
    it("Must let user to deposit", async function(){
        const [owner, user] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        const tx = await bank.connect(user).deposit({ value: amount });
        await tx.wait();
        const bal = await bank.balanceOf(user.address);
        expect(bal).to.equal(amount);
    })

    //withdraw
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

    //reject deposit
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

    //reject withdraw
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

    //approve
    it("it must let user1 to give approve to user2", async function(){
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("10");
        const approving = await bank.connect(user1).approve(user2.address, amount)
        expect(await bank.allowance(user1.address, user2.address)).to.equal(amount);
    })

    // reject approve
    it("it must reject if user wanna approve to zero address", async function(){
        let errorCaught = false;
        const [, user] = await ethers.getSigners();
        const amount = ethers.parseEther("10");
        try{
            const ErrorApproving = await bank.connect(user).approve(ethers.ZeroAddress, amount);
        } catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert");
            expect(error.message).to.include("Incorrect address entered");
        }
        expect(errorCaught).to.equal(true);
    })

    //TransferFrom
    it("must let tranfer from approved user", async function(){
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("10")
        const amount2 = ethers.parseEther("5")
        await bank.connect(user1).deposit({value: amount});
        const balanceUser2 = await bank.balanceOf(user2.address);
        const approving = await bank.connect(user1).approve(user2.address, amount2);
        const transfering = await bank.connect(user2).transferFrom(user1.address, user2.address, amount2);
        const balanceOfExpect = balanceUser2 + amount2;
        expect(await bank.balanceOf(user1.address)).to.equal(amount2);
        expect(await bank.balanceOf(user2.address)).to.equal(balanceOfExpect);
        expect(await bank.allowance(user1.address, user2.address)).to.equal(0n);
    })

    //transferFrom reject to address zero
     it("it must reject if user wanna transfer to zero address", async function(){
        let errorCaught = false;
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("10")
        const amount2 = ethers.parseEther("5")
        await bank.connect(user1).deposit({value: amount});
        const approving = await bank.connect(user1).approve(user2.address, amount2);
        try{
          const transfering = await bank.connect(user2).transferFrom(user1.address, ethers.ZeroAddress, amount2);
        } catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert");
            expect(error.message).to.include("Incorrect address entered");
        }
        expect(errorCaught).to.equal(true);
    })

     //transferFrom reject to transfer more than user1 has
     it("it must reject to transfer more than user1 has", async function(){
        let errorCaught = false;
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("1")
        const amount2 = ethers.parseEther("5")
        const amount3 = ethers.parseEther("3")
        await bank.connect(user1).deposit({value: amount});
        const approving = await bank.connect(user1).approve(user2.address, amount2);
        try{
          const transfering = await bank.connect(user2).transferFrom(user1.address, user2.address, amount3);
        } catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert");
            expect(error.message).to.include("user doesn't have enough money");
        }
        expect(errorCaught).to.equal(true);
    })

      //transferFrom reject if user2 wanna transfer more than he was approved
     it("it must reject if user2 wanna transfer more than he was approved", async function(){
        let errorCaught = false;
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("1")
        const amount2 = ethers.parseEther("5")
        const amount3 = ethers.parseEther("3")
        await bank.connect(user1).deposit({value: amount2});
        const approving = await bank.connect(user1).approve(user2.address, amount);
        try{
          const transfering = await bank.connect(user2).transferFrom(user1.address, user2.address, amount3);
        } catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert");
            expect(error.message).to.include("user doesn't have enough allowed money");
        }
        expect(errorCaught).to.equal(true);
    })

    //must let user to transfer money
    it("must let user to transfer money", async function(){
        const [, user1, user2] = await ethers.getSigners();
        const balanceUser2 = await bank.balanceOf(user2.address)
        await bank.connect(user1).deposit({value: ethers.parseEther("2")})
        await bank.connect(user1).transfer(user2.address, ethers.parseEther("1"))
        const balanceUser2Expect = balanceUser2 + ethers.parseEther("1");
        expect(await bank.balanceOf(user1.address)).to.equal(ethers.parseEther("1"))
        expect(await bank.balanceOf(user2.address)).to.equal(balanceUser2Expect);
    })

    //must reject to transfer to zero address
    it("must reject to transfer to zero address", async function(){
        let errorCaught = false;
        const [, user1] = await ethers.getSigners();
        await bank.connect(user1).deposit({value: ethers.parseEther("2")})
       try{
         await bank.connect(user1).transfer(ethers.ZeroAddress, ethers.parseEther("1"))
       } catch(error){
        errorCaught = true;
        expect(error.message).to.include("revert")
        expect(error.message).to.include("Incorrect address entered")
       }

       expect(errorCaught).to.equal(true);
    })

    //must reject if user wanna transfer more than he has
    it("must reject if user wanna transfer more than he has", async function () {
        let errorCaught = false;
        const [, user1, user2] = await ethers.getSigners();
        await bank.connect(user1).deposit({value: ethers.parseEther("2")})
        const balanceUser1 = await bank.balanceOf(user1.address);
        const balanceUser2 = await bank.balanceOf(user2.address);
        try{
            await bank.connect(user1).transfer(user2.address, ethers.parseEther("3"))
        }
        catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert");
            expect(error.message).to.include("user doesn't have enough money")
        }
        expect(errorCaught).to.equal(true);
        expect(await bank.balanceOf(user1.address)).to.equal(balanceUser1);
        expect(await bank.balanceOf(user2.address)).to.equal(balanceUser2);
    })
    
    // must increase allowance
    it("must increase allowance", async function(){
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        await bank.connect(user1).approve(user2.address, amount);
        const allowedNum = await bank.allowance(user1.address, user2.address);
        await bank.connect(user1).increaseAllowance(user2.address, ethers.parseEther("2"))
        const allowedNumExpect = allowedNum + ethers.parseEther("2");
        expect(await bank.allowance(user1.address, user2.address)).to.equal(allowedNumExpect);
    })

    // must reject to increaseAllowance to zero address
    it("must reject to increaseAllowance to zero address", async function(){
        let errorCaught = false;
        const [, user1] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        try{
            await bank.connect(user1).increaseAllowance(ethers.ZeroAddress, amount)
        }catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert")
            expect(error.message).to.include("Incorrect address entered")
        }
        expect(errorCaught).to.equal(true)
    })

    // must to decrease Allowance
    it("must to decrease Allowance", async function(){
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("3");
        await bank.connect(user1).approve(user2.address, amount);
        const allowedNum = await bank.allowance(user1.address, user2.address);
        await bank.connect(user1).decreaseAllowance(user2.address, ethers.parseEther("2"))
        const allowedNumExpect = allowedNum - ethers.parseEther("2");
        expect(await bank.allowance(user1.address, user2.address)).to.equal(allowedNumExpect);
    })

    //must reject to zero address
    it("must reject to zero address", async function(){
        let errorCaught = false;
        const [, user1] = await ethers.getSigners();
        const amount = ethers.parseEther("1");
        try{
            await bank.connect(user1).decreaseAllowance(ethers.ZeroAddress, amount)
        }catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert")
            expect(error.message).to.include("Incorrect address entered")
        }
        expect(errorCaught).to.equal(true)
    })

    //must reject if value to subtraction is more than user has
    it("must reject if value to subtraction is more than user has", async function(){
        let errorCaught = false;
        const [, user1, user2] = await ethers.getSigners();
        const amount = ethers.parseEther("2");
        await bank.connect(user1).approve(user2.address, amount);
        try{
            await bank.connect(user1).decreaseAllowance(user2.address, ethers.parseEther("5"))
        }catch(error){
            errorCaught = true;
            expect(error.message).to.include("revert")
            expect(error.message).to.include("value to subtraction is more than user has")
        }
        expect(errorCaught).to.equal(true)
    })

    //must show contracts balance
    it("must show contractss balance", async function(){
        const [, user] = await ethers.getSigners();
        await bank.connect(user).deposit({value: ethers.parseEther("100")})
        expect(await bank.balanceOfBank()).to.equal(ethers.parseEther("100"))
    })

})

