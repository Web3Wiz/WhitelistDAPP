//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Whitelist {

    //Lets define max number of whitelisted addresses
    uint8 public maxWhitelistedAddresses;

    //Count of whitelisted addresses
    uint8 public numAddressesWhitelisted;

    //Variable to save whitelisted addresses
    mapping( address => bool) public whitelist;

    constructor (uint8 _maxWhitelistedAddresses) {
        //Define max number of whitelisted addresses on basis of input param
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }


    function add() public {
        //Lets apply checks first ..
        require(!whitelist[msg.sender], "User address is already whitelisted.");
        require(numAddressesWhitelisted <= maxWhitelistedAddresses, "More addresses can not be whitelisted. Max limit reached!");
        
        //All good. Lets add whitelisted address ..
        whitelist[msg.sender] = true;
        numAddressesWhitelisted++;
    }

}


/*
Whitelist contract address is 0x69b2db119Cb68b8853147e751110d25d35742139
*/