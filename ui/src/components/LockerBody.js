import React from 'react';

import { Container, Stack } from '@mui/material';
import AccountStatus from './AccountStatus';
import LockerOptions from './LockerOptions';
import LockerNotification from "./LockerNotification";

const LockerBody = (props) => {
   const { drizzle, drizzleState } = props;
   return (
      <Container maxWidth="md" sx={{ height: 'inherit' }}>
         <Stack spacing={6}>
            <AccountStatus drizzle={drizzle} drizzleState={drizzleState} />
            <LockerOptions drizzle={drizzle} drizzleState={drizzleState} />
             <LockerNotification
                 drizzle={drizzle}
                 drizzleState={drizzleState}/>

         </Stack>
      </Container>
   );
};

export default LockerBody;
