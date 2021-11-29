// App.js

import React from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import LockerManagerV1 from './contracts/LockerManagerV1.json';

import { CircularProgress, Container } from '@mui/material';
import LockerBody from './components/LockerBody';
import LockerHeader from './components/LockerHeader';

import './App.css';

const drizzleOptions = {
   contracts: [LockerManagerV1],
   events: {
      //at this point we cannot filter by address or lockerId
      LockerManagerV1: ['lockerOpened', 'lockerClosed'],
   },
};

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
   return (
      <Container maxWidth="false" className="PageBackground">
         <Container maxWidth="md" className="AppBackground">
            <LockerHeader />
            <DrizzleContext.Provider drizzle={drizzle}>
               <DrizzleContext.Consumer>
                  {(drizzleContext) => {
                     const { drizzle, drizzleState, initialized } =
                        drizzleContext;
                     if (!initialized) {
                        return <CircularProgress color="inherit" />;
                     } else {
                        return (
                           <LockerBody
                              drizzle={drizzle}
                              drizzleState={drizzleState}
                           />
                        );
                     }
                  }}
               </DrizzleContext.Consumer>
            </DrizzleContext.Provider>
         </Container>
      </Container>
   );
};

export default App;
