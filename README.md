# upgradeable-smart-contract-example
using OZ libraries to deploy an upgradeable smart contract using `deployProxy`


`npx hardhat node`
`npx hardhat run --network localhost scripts/deploy_upgradeable_contract.js`
`npx hardhat console --network localhost`


```js
> const Pomogra = await ethers.getContractFactory("Pomogra")
undefined
> const pomogra = await Pomogra.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
undefined
> (await pomogra.retrieve()).toString()
[
  [
    'First message!',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    message: 'First message!',
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  ]
]
```