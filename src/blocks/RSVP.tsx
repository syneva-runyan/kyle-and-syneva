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
                return <Questionaire guestInfo={guestInfo}  onConfirmation={onConfirmation}/>
        case "confirmation":
            return guestResponses && <Confirmation guestResponses={guestResponses} />
    }
}