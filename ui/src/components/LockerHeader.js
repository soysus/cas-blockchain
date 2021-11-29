import React from 'react';

import {
   Container,
   Divider,
   Typography,
} from '@mui/material';

const LockerHeader = () => {
   return (
      <Container
         maxWidth="false"
         sx={{
            paddingTop: '30px',
            paddingBottom: '30px',
            background: 'white',
         }}
      >
         <Typography gutterBottom variant="h3" component="div">
            Locker Manager
         </Typography>
         <Typography gutterBottom variant="h7" component="div" color="darkgrey">
            {new Date().toLocaleString() + ''}
         </Typography>
         <Divider variant="fullWidth" />
      </Container>
   );
};

export default LockerHeader;
