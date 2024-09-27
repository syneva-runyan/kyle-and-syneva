import { useState } from "react";
import Lookup from '../Components/RSVP/Lookup';
import Questionaire, { guestInfoResponse, guestInfoType } from "../Components/RSVP/Questionaire";
import Confirmation from "../Components/RSVP/Confirmation";

export default function RSVPIndex() {
    const [stageInProcess, setStageInProcess] = useState("lookup");
    const [guestInfo, setGuestInfo] = useState<guestInfoResponse>();
    const [guestResponses, setGuestResponses] = useState<guestInfoType>();

    function selectGuest(guestInfo: guestInfoResponse) {
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
            return <Confirmation guestResponses={guestResponses} />
    }
}