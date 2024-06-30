import { useState } from "react";
import Lookup from '../Components/RSVP/Lookup';
import Questionaire from "../Components/RSVP/Questionaire";

export default function RSVPIndex() {
    const [guestInfo, setGuestInfo] = useState();
    const [guestResponses, setGuestResponses] = useState();
    return (
        <>
        
                {guestInfo ?
                    <Questionaire guestInfo={guestInfo} setGuestResponses={setGuestResponses} /> :
                    <Lookup setGuestInfo={setGuestInfo} />
                }
        </>
    )
}