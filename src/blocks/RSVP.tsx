import { useState } from "react";
import Lookup from '../Components/RSVP/Lookup';
import Questionaire, { guestInfoType } from "../Components/RSVP/Questionaire";
import Confirmation from "../Components/RSVP/Confirmation";

import './RSVP.css';

export default function RSVPIndex() {
    const [stageInProcess, setStageInProcess] = useState("lookup");
    const [guestInfo, setGuestInfo] = useState<guestInfoType>();
    const [guestResponses, setGuestResponses] = useState<guestInfoType>();

    function selectGuest(guestInfo: guestInfoType) {
        // hacky code to add default attending status
        const updatedPartyMembers = guestInfo.partyMembers.map(member => {
            return {
                "attending": true,
                "eventsAttending": {
                    "Thursday evening dinner and welcome party": false,
                    "Friday afternoon lunch and activity":  false,
                    "Friday evening rehersal dinner and drinks": false,
                    "Saturday wedding and reception": false
                },
                ...member
            }
        });
        guestInfo.partyMembers = updatedPartyMembers;
        setGuestInfo(guestInfo);
        setStageInProcess("questions");
    }

    function onConfirmation(guestResponses: guestInfoType) {
        setGuestResponses(guestResponses)
        setStageInProcess("confirmation")
    }

    switch(stageInProcess) {
        case "lookup":
            return <Lookup setGuestInfo={selectGuest} />
            case "questions":
                // @ts-ignore
                return <Questionaire guestInfo={guestInfo}  onConfirmation={onConfirmation}/>
        case "confirmation":
            return guestResponses && <Confirmation guestResponses={guestResponses} />
    }
}