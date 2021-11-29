import React from 'react';

import {
   Accordion,
   AccordionDetails,
   AccordionSummary,
   Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockerAction from './LockerAction';
const LockerOptions = (props) => {
   const { drizzle, drizzleState } = props;

   return (
      <div>
         <Accordion>
            <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header"
            >
               <Typography variant="h5">Open Locker</Typography>
            </AccordionSummary>
            <AccordionDetails>
               <LockerAction
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  buttonName={'Open'}
                  method={'openLocker'}
                  color={'primary'}
               />
            </AccordionDetails>
         </Accordion>
         <Accordion>
            <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel2a-content"
               id="panel2a-header"
            >
               <Typography variant="h5">Close Locker</Typography>
            </AccordionSummary>
            <AccordionDetails>
               <LockerAction
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  buttonName={'Close'}
                  method={'closeLocker'}
                  color={'secondary'}
               />
            </AccordionDetails>
         </Accordion>
      </div>
   );
};

export default LockerOptions;
