// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const Pomogra = await ethers.getContractFactory("Pomogra");
  console.log("Deploying Pomogra...");
  const pomogra = await upgrades.deployProxy(Pomogra, ["First message!"], { initializer: 'addPaper' });
  await pomogra.deployed();
  console.log("Pomogra deployed to: ", pomogra.address);
}

main();