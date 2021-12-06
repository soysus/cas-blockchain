const LockerManager = artifacts.require('LockerManagerV2');
const truffleAssert = require('truffle-assertions');

contract('LockerManagerV2', (accounts) => {
   let manager;
   let pricePerBlock;
   let totalPrice;
   const LOCKER_1_ID = web3.utils.utf8ToHex('1');
   const LOCKER_2_ID = web3.utils.utf8ToHex('2');
   const LOCKER_3_ID = web3.utils.utf8ToHex('3');
   const LOCKED_TIME_IN_BLOCKS = 10; //aprox. the number of blocks in one hour
   const OWNER_ADDRESS = accounts[0];
   const NON_OWNER_ADDRESS_1 = accounts[1];
   const NON_OWNER_ADDRESS_2 = accounts[2];

   before(() => {
      return LockerManager.deployed().then(async (contract) => {
         manager = contract;
         pricePerBlock = await manager.getCurrentPricePerBlock();
         totalPrice = LOCKED_TIME_IN_BLOCKS * pricePerBlock;
      });
   });

   describe('V2: the locker is free', () => {
      it('can be locked', async () => {
         return manager
            .closeLockerFor(LOCKER_1_ID, LOCKED_TIME_IN_BLOCKS, {
               from: NON_OWNER_ADDRESS_1,
               value: totalPrice,
            })
            .then(async (result) => {
               assert.isTrue(await manager.isLockerClosed(LOCKER_1_ID));
               truffleAssert.eventEmitted(result, 'lockerClosed', (ev) => {
                  return ev.closer === NON_OWNER_ADDRESS_1;
               });
               assert.equal(result.logs.length, 1);
               const balance = await web3.eth.getBalance(manager.address);
               assert.equal(balance, totalPrice);
               const remainingBlocksAt0 = await manager.getRemainingBlocks(
                  LOCKER_1_ID
               );
               console.assert(
                  LOCKED_TIME_IN_BLOCKS,
                  remainingBlocksAt0.toNumber()
               );
            });
      });
      it('cannot be locked if insufficient amount', () => {
         return manager
            .closeLockerFor(LOCKER_2_ID, LOCKED_TIME_IN_BLOCKS, {
               from: NON_OWNER_ADDRESS_1,
               value: totalPrice - 1,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Incorrect amount');
            });
      });
      it('cannot be opened again', () => {
         return manager
            .openLocker(LOCKER_2_ID, {
               from: NON_OWNER_ADDRESS_1,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
      it('cannot increase the timer', () => {
         return manager
            .increaseRemainingBlocks(LOCKER_2_ID, 1, {
               from: NON_OWNER_ADDRESS_1,
               value: pricePerBlock,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
   });
   //locker1 is closed in the previous tests
   describe('V2: the locker is closed', () => {
      it('cannot close twice the same compartment', () => {
         return manager
            .closeLockerFor(LOCKER_1_ID, LOCKED_TIME_IN_BLOCKS, {
               from: NON_OWNER_ADDRESS_1,
               value: totalPrice,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Locker is already closed');
            });
      });
      it('cannot take a compartment currently taken', () => {
         return manager
            .closeLockerFor(LOCKER_1_ID, LOCKED_TIME_IN_BLOCKS, {
               from: OWNER_ADDRESS,
               value: totalPrice,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Locker is already closed');
            });
      });
      it('cannot be opened from another account', () => {
         return manager
            .openLocker(LOCKER_1_ID, { from: OWNER_ADDRESS })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
      it('cannot open another compartment ', () => {
         return manager
            .openLocker(LOCKER_3_ID, { from: NON_OWNER_ADDRESS_1 })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
      it('can increase the timer', async () => {
         const remainingBlocksAt0 = await manager.getRemainingBlocks(
            LOCKER_1_ID
         );
         return manager
            .increaseRemainingBlocks(LOCKER_1_ID, 1, {
               from: NON_OWNER_ADDRESS_1,
               value: pricePerBlock,
            })
            .then(async () => {
               const remainingBlocksAt1 = await manager.getRemainingBlocks(
                  LOCKER_1_ID
               );

               assert.equal(
                  remainingBlocksAt0.toNumber(),
                  remainingBlocksAt1.toNumber()
               );
            });
      });
      it('can transferred from allowedOpener', async () => {
         return manager
            .transferLocker(LOCKER_1_ID, NON_OWNER_ADDRESS_2, {
               from: NON_OWNER_ADDRESS_1,
            })
            .then(() => {
               return manager
                  .openLocker(LOCKER_1_ID, {
                     from: NON_OWNER_ADDRESS_1,
                  })
                  .then(() => {
                     throw new Error('this test shall fail!');
                  })
                  .catch((error) => {
                     assert.equal(
                        error.reason,
                        "Locker doesn't belong to address"
                     );
                  });
            });
      });
      it('cannot be transferred if not allowedOpener', async () => {
         return manager
            .transferLocker(LOCKER_1_ID, NON_OWNER_ADDRESS_2, {
               from: NON_OWNER_ADDRESS_1,
            })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Cannot be transferred');
            });
      });
      it('can be transferred if payment expired', async () => {
         const initialRemainingBlocks = await manager.getRemainingBlocks(
            LOCKER_1_ID
         );
         return manager
            .transferLocker(LOCKER_1_ID, NON_OWNER_ADDRESS_1, {
               from: NON_OWNER_ADDRESS_1,
            })
            .then(async () => {
               assert.equal(initialRemainingBlocks, 0);
            });
      });
      it('can be opened from the allowedOpener ', () => {
         return manager
            .openLocker(LOCKER_1_ID, { from: NON_OWNER_ADDRESS_1 })
            .then(async (result) => {
               assert.isFalse(await manager.isLockerClosed(LOCKER_1_ID));
               truffleAssert.eventEmitted(result, 'lockerOpened');
               assert.equal(result.logs.length, 1);
            });
      });
   });
   describe('V2: price', () => {
      it('can be changed by owner ', () => {
         const newPricePerBlock = web3.utils.toWei('1', 'milli');
         return manager
            .setCurrentPricePerBlock(newPricePerBlock, { from: OWNER_ADDRESS })
            .then(async () => {
               assert.equal(newPricePerBlock, await manager.getCurrentPricePerBlock());
            });
      });
      it('cannot be changed by others ', () => {
         const newPricePerBlock = web3.utils.toWei('1', 'micro');
         return manager
             .setCurrentPricePerBlock(newPricePerBlock, { from: NON_OWNER_ADDRESS_1 })
             .then(async () => {
                throw new Error('this test shall fail!');
             })
             .catch((error) => {
                assert.equal(error.reason, 'Ownable: caller is not the owner');
             });
      });
   });
});
