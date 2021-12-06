// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

//elements can be outside of the library, so that they can be imported directly without LockerManagerV2Library.element
    // common struct for lockers
    struct locker {
        //user's address with opening rights
        address allowedOpener;
        //time till when the closing is ensured
        uint lockedUntilBlock;
    }

    error PaymentNotAccepted();
    error DeprecatedFunction(string useInstead);

//no common functions extracted
library LockerManagerV2Library {

}
