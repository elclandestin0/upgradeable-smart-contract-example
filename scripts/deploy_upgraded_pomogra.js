// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
  const PomograV2 = await ethers.getContractFactory("PomograV2");
  console.log("Upgrading Pomogra with POMOGRAv2...");
  const pomogra = await upgrades.upgradeProxy("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", PomograV2);
  console.log("Pomogra upgraded");
}
main();