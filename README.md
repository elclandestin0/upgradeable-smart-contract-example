# upgradeable-smart-contract-example
using OZ libraries to deploy an upgradeable smart contract using `deployProxy`

## Upgrades theory
When you deploy an upgradeable contract, you really deploy 3 different contracts
- Implementation contract, or the original contract you wrote that contains all the logic
- Proxy contract, the contract that you interact with
- Proxy admin, which contains the admin that interacts with the prxy contract

When interacting with the upgradeable contract, you don't interact with the implementation contract. You interact with the proxy. So, when upgrading the proxy, you are effectively deploying a **new** implementation contract, while updating the implementation address of the proxy with the new implementation contract. This keeps the address of the proxy while at the same time gives us new and updated logic. 

Multiple proxies can interact with one implementation contract. This is useful if one wants to divide proxy storage across multiple contracts. 

## Limitations 
### Constructor 
Proxies can never read the implementation of `constructors()` due to the nature of the solidity language. This is because a `constructor()` is not part of a deployed contract's runtime code .. and it will only be called once (when the implementation contract instance is deployed). This results in a proxy contract never seeing the existence of a `constructor()`. 

Solving this is simple, as we only need to use `initializer` modifier provided by OpenZeppelin. What it does is injects a modifier that ensures the `initialize()` is only called once. Upon doing so, we can then add the same logic we would've added to the `constructor()`. When deploying the contract, however, we need to manually simplify what the initializer function is using the `initializer` keyboard from the `hardhat` library in Node.js.

### Storage
Although we can add new variables, we cannot change the storage **layout** of our contract. When upgrading the proxy, this means: not removing the original state variables, not changing it's type and not declaring a variable(s) before it. 

In the example below: 

```solidity
// first proxy contract
contract Sample {
    uint256 private someValue;
}

// second proxy contract
contract Sample {
    // not allowed: uint16 private someValue
    // not allowed: uint256 private newValue
    // not allowed: deleting uint256 private someValue
    uint256 private someValue;
    // allowed: adding new state variables after
}

```