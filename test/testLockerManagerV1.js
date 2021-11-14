const LockerManager = artifacts.require('LockerManagerV1');
const truffleAssert = require('truffle-assertions');

contract('LockerManagerV1', (accounts) => {
   let manager;
   const LOCKER_1_ID = '1';
   const LOCKER_2_ID = '2';

   before(() => {
      return LockerManager.deployed().then((contract) => (manager = contract));
   });

   describe('the locker is free', () => {
      it('can be locked', () => {
         return manager
            .closeLocker(LOCKER_1_ID, { from: accounts[0] })
            .then(async (result) => {
               assert.isTrue(await manager.isLockerClosed(LOCKER_1_ID));
               truffleAssert.eventEmitted(result, 'lockerClosed', (ev) => {
                  return ev._owner === accounts[0];
               });
               assert.equal(result.logs.length, 1);
            });
      });
      it('can lock multiple compartments', () => {
         return manager
            .closeLocker(LOCKER_2_ID, { from: accounts[0] })
            .then(async (result) => {
               assert.isTrue(await manager.isLockerClosed(LOCKER_2_ID));
               truffleAssert.eventEmitted(result, 'lockerClosed', (ev) => {
                  return ev._owner === accounts[0];
               });
               assert.equal(result.logs.length, 1);
            });
      });
   });

   //locker1 and locker2 are closed in the previous tests
   describe('the locker is closed', () => {
      it('cannot close twice the same compartment', () => {
         return manager
            .closeLocker(LOCKER_1_ID, { from: accounts[0] })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Locker is already closed');
            });
      });
      it('cannot take a compartment currently taken ', () => {
         return manager
            .closeLocker(LOCKER_1_ID, { from: accounts[1] })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, 'Locker is already closed');
            });
      });
      it('cannot be opened from another account', () => {
         return manager
            .openLocker(LOCKER_1_ID, { from: accounts[1] })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
      it('cannot open another compartment ', () => {
         return manager
            .openLocker('xyz', { from: accounts[0] })
            .then(() => {
               throw new Error('this test shall fail!');
            })
            .catch((error) => {
               assert.equal(error.reason, "Locker doesn't belong to address");
            });
      });
      it('can be opened from the closing account ', () => {
         return manager
            .openLocker(LOCKER_1_ID, { from: accounts[0] })
            .then(async (result) => {
               assert.isFalse(await manager.isLockerClosed(LOCKER_1_ID));
               truffleAssert.eventEmitted(result, 'lockerOpened');
               assert.equal(result.logs.length, 1);
            });
      });
   });
});
