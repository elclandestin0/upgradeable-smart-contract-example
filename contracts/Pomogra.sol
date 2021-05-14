//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
    @title Pomogra
    @author Memo Khoury
    @dev Upgradable version of pomogra
 */

contract Pomogra {
    Paper[] private _chain;

    struct Paper {
        string message;
        address owner;
    }

    event PaperAdded(string indexed message, address owner);

    function addPaper(string memory message_) public {
        _chain.push(Paper(message_, msg.sender));
        emit PaperAdded(message_, msg.sender);
    }

    function chain() public view returns (Paper[] memory) {
        return _chain;
    }

}
