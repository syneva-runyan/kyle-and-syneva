import { useState } from 'react';
import LookupInfo from './LookUpInfo';
import './WeddingInfo.css';
import YourWeekend from './YourWeekend';
import { guestInfoType } from '../RSVP/Questionaire';

function WeddingInfo() {
    const [guestInfo, setGuestInfo] = useState<guestInfoType | undefined>(undefined);
    if (guestInfo) {
        return <YourWeekend guestInfo={guestInfo} searchAnotherParty={() => { setGuestInfo(undefined)}}/>;
    }
    return (
        <div className='weddingInfo'>
            <h1>Your Weekend</h1>
            <p>Find information about your room and table at reception here.</p>
            <LookupInfo setGuestInfo={setGuestInfo} />
        </div>
    );
}

export default WeddingInfo;
