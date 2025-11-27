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
  
  }

  
};