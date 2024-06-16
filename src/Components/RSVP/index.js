import React, { useState } from 'react';
import Lookup from './Lookup';
import Questionaire from './Questionaire';
import Confirmation from './Confirmation';
import DeclinedConfirmation from './DeclinedConfirmation';

import {
    Switch,
    Route,
  } from "react-router-dom";


export default function RSVPIndex() {
    const [guestInfo, setGuestInfo] = useState();
    const [guestResponses, setGuestResponses] = useState();
    return (
        <>
        <Switch>
            <Route path="/rsvp/accept-confirmation">
                <Confirmation guestResponses={guestResponses} guestInfo={guestInfo} />
            </Route>
            <Route path="/rsvp/decline-confirmation">
                <DeclinedConfirmation />
            </Route>
            <Route path="/rsvp">
                {guestInfo ?
                    <Questionaire guestInfo={guestInfo} setGuestResponses={setGuestResponses} /> :
                    <Lookup setGuestInfo={setGuestInfo} />}
            </Route>
        </Switch>
        </>
    );
}