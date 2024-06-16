import { useState } from "react";
import Lookup from '../Components/RSVP/Lookup'

export default function RSVPIndex() {
    const [guestInfo, setGuestInfo] = useState();
    // const [guestResponses, setGuestResponses] = useState();
    return <Lookup setGuestInfo={setGuestInfo} />;
}
        // <>
        
        //         {guestInfo ?
        //             <Questionaire guestInfo={guestInfo} setGuestResponses={setGuestResponses} /> :
        //             <Lookup setGuestInfo={setGuestInfo} />}
        // </>