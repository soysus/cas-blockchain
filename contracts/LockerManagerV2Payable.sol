// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LockerManagerV2Core.sol";

//contract defining the owner functions
contract LockerManagerV2Payable is Ownable, LockerManagerV2Core {

    // Function to withdraw all Ether from this contract
    function withdraw() public onlyOwner {
        // get the amount of Ether stored in this contract
        uint amount = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success,) = owner().call{value : amount}("");
        require(success, "Failed to withdraw");
    }

    // Function to transfer Ether from this contract to address from input
    function transfer(address payable _to, uint _amount) public onlyOwner {
        // "to" is payable
        (bool success,) = _to.call{value : _amount}("");
        require(success, "Failed to transfer");
    }

    //this contract allows payments
    receive() external override payable {
    }
}