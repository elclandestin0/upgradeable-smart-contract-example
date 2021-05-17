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
## Proxy Upgrade Pattern

```
User ---- tx ---> Proxy ----------> Implementation_v0
                     |
                      ------------> Implementation_v1
                     |
                      ------------> Implementation_v2
```

Interfacing the proxy contract with the logic contract using a one-to-one mapping is not only tedious, but also prone to many different errors. For this reason, a dynamic forwarding mechanism is required. When the caller calls a logic contract, they are really doing the following to the proxy's fallback function:
- copying callback data to memory
- call is forwarded to logic contract
- return the data from the call to the logic contract to the proxy
- returned data to the proxy is forwarded back to the caller

It is important to note that the state is in the proxy, which is controlled by the logic contract. The logic, however, is contained in the logic contract. 



## Storage collisions
Suppose a proxy contract contains one state variable `address public _implementation` which stores the logic contract's address. Inside the logic contract, suppose it contains one state variable called `address public _owner`. When the logic contract writes to the `_owner`, it writes in the proxy's state.. which means it really writes in the `_implementation`. This is called storage collision. 

Open Zeppelin Upgrades solves this problem by choosing a random pseudo slot anytime a proxy variable is created.

### Storage collisions between different implementation contract versions
We've described before in this README file how we are supposed to order new variables when creating new implementation contracts. The reason why we neither can remove old variables nor change their layout is due to their slots. If we add a new variable `_lastContributor` to the new implementation contract at the _end_ of the order of state variables, this is ok. However, adding a new variable at the _beginning_ of an implementation contract will overwrite the slot of the first variable in the previous contract. 


## Function clashes
There are times where functions of the implementation contracts and proxy contracts have the same name. Calling a function with the same name in a proxy and an implementation contract will result in a function clash. The way OZ deals with this is by detecting who the `msg.sender` is and reacting accordingly. As an example:
- If the `msg.sender` is the admin of the proxy, then the proxy will not delegate any calls to the logic contract
- If, however, the `msg.sender` is not the admin of the proxy, then it will delegate the calls to the logic contract. 

OZ upgrades automatically solves this situation by creating an intermediary ProxyAdmin contract, as described before. This proxyAdmin contract is in charge of all the proxies that are created.