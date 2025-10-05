// Импорт плагина Hardhat Toolbox. Он включает всё необходимое:
// тестирование, Chai-матчеры, Ethers.js, и многое другое.
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // 1. КОНФИГУРАЦИЯ SOLC (Solidity Compiler)
  solidity: {
    version: "0.8.30", // Установи ту версию, которую ты указал в контракте (pragma solidity ^0.8.30;)
    settings: {
      optimizer: {
        enabled: true, // Включает оптимизатор для уменьшения стоимости газа
        runs: 200     // Стандартное количество запусков
      }
    }
  },

  // 2. КОНФИГУРАЦИЯ СЕТЕЙ (Networks)
  networks: {
    // Эта сеть используется по умолчанию при npx hardhat test или npx hardhat run
    hardhat: {
      // Здесь могут быть настройки для локальной сети Hardhat, но обычно они не нужны
    },
    // Пример конфигурации для тестовой сети Sepolia (если ты захочешь деплоить контракт в реальную сеть)
    // sepolia: {
    //   url: "YOUR_ALCHEMY_OR_INFURA_URL", // Ссылка на RPC-провайдера (Infura, Alchemy и т.д.)
    //   accounts: ["YOUR_PRIVATE_KEY"]    // Приватный ключ аккаунта для оплаты транзакций
    // }
  }

  // 3. КОНФИГУРАЦИЯ ГАЗА (Gas Reporter)
  // Это опционально, но полезно для оценки стоимости газа в твоих тестах
  // gasReporter: {
  //   enabled: true,
  //   currency: "USD",
  //   coinmarketcap: "YOUR_COINMARKETCAP_API_KEY",
  //   gasPrice: 20
  // }
};