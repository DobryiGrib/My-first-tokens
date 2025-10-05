// test/MyToken.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyERC721Token", function () {
    let MyToken;
    let myToken;
    let owner;
    let addr1;
    let addr2;

    // Этот блок запускается перед каждым тестом (it)
    beforeEach(async function () {
        // 1. Получаем список тестовых аккаунтов
        [owner, addr1, addr2] = await ethers.getSigners();
        
        // 2. Получаем "фабрику" контракта (скомпилированный код)
        MyToken = await ethers.getContractFactory("MyERC721Token");

        // 3. Разворачиваем контракт и ждем его деплоя
        myToken = await MyToken.deploy();
        await myToken.waitForDeployment();
    });

     it("Should set the correct name and symbol upon deployment", async function () {
        expect(await myToken.name()).to.equal("First Token");
        
        expect(await myToken.symbol()).to.equal("FTK");
    });

    it("Should allow the owner to mint a new token", async function () {
        // Вызываем mint, чтобы создать токен для addr1
        await myToken.mint(addr1.address);
        
        // Проверяем, что баланс NFT у addr1 стал равен 1
        expect(await myToken.balanceOf(addr1.address)).to.equal(1n);
        
        // Проверяем, что токен с ID 1 принадлежит именно addr1
        expect(await myToken.ownerOf(1n)).to.equal(addr1.address);
    });

    it("Should NOT allow a non-owner to mint a token", async function () {
       let errorCaught = false; // Флаг для отслеживания ошибки

    try {
        // Пытаемся вызвать mint от имени addr1 (не владельца)
        await myToken.connect(addr1).mint(addr1.address);
    } catch (error) {
        // Если произошла ошибка (транзакция отменилась), мы ловим ее здесь
        errorCaught = true;
    }

    // Проверяем, что ошибка ДЕЙСТВИТЕЛЬНО была поймана
    expect(errorCaught).to.be.true; 
    });

    // Здесь будут наши тесты
});