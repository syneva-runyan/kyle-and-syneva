import { useState, useRef } from "react";

// import { useHistory } from "react-router-dom";
// import { saveResponse } from './api';

import './Questionaire.css';
import Attending from './Attending'
import ResponseDetails from "./ResponseDetails";
import StayingOnsite from "./StayingOnsite";

export interface partyMemberType {
    name: string,
    isAdult: boolean,
    attending: boolean,
    eventsAttending: {
        "Thursday evening dinner and event": boolean,
        "Friday afternoon lunch and activity": boolean,
        "Friday evening rehersal dinner": boolean,
        "Saturday wedding and reception": boolean
    },
    foodPreferences: string,
    additionalComments: string,
    stayingOnsite: boolean,
}

interface partyMemberServerResponseType {
    name: string,
    isAdult: boolean,
}
  
interface guestInfoResponse {
    name: string,
    partyMembers: partyMemberServerResponseType[]
}

export interface guestInfoType {
    name: string,
    partyMembers: partyMemberType[]
 }
   

const defaultRSVP = {
    attending: true,
    eventsAttending: {
        "Thursday evening dinner and event": false,
        "Friday afternoon lunch and activity": false,
        "Friday evening rehersal dinner": false,
        "Saturday wedding and reception": false
    },
    stayingOnsite: true,
    foodPreferences: "",
    additionalComments: "",
}

export default function Questionaire({ guestInfo }: { guestInfo: guestInfoResponse }) {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [guestRSVP, setGuestRSVP] = useState(
        { ...guestInfo, 
            partyMembers: guestInfo.partyMembers.map(({name, isAdult}: partyMemberServerResponseType) : partyMemberType =>  (
                { name, isAdult, ...defaultRSVP }
            ))
        }
    );

    const formEl = useRef(null);

    const back = async (e) => {
        e.preventDefault();
        setQuestionIndex(questionIndex - 1);
    }
    const next = async (e) => {
        e.preventDefault();
        setQuestionIndex(questionIndex + 1);
    }

    const setRSVP = (partyMemberIndex: number, field: string, value: any) => {
        const updatedResponse = { ...guestRSVP };
        // @ts-ignore
        updatedResponse.partyMembers[partyMemberIndex][field] = value
        setGuestRSVP(updatedResponse);
    }

    function getQuestion(questionIndex: number){
        switch (questionIndex) {
            case 0:
                return <Attending guestRSVP={guestRSVP} setRSVP={setRSVP} />
            case 1:
                return <ResponseDetails partyMembers={guestRSVP.partyMembers} setRSVP={setRSVP} />
            case 2:
                return <StayingOnsite partyMembers={guestRSVP.partyMembers} setRSVP={setRSVP}  />
            default:
                <Attending guestRSVP={guestRSVP} setRSVP={setRSVP} />;
        }
    }

    return (
        <div className="questionaire">
            <h3>{guestInfo.name}</h3>
            <form ref={formEl}>
                {getQuestion(questionIndex)}
                <div className="guestDetailsCTAs">
                    <div className="">
                        { questionIndex > 0 && <button className="rsvp-lookup__btn" onClick={back}>Back</button> }
                    </div>
                    <div className="nextBtn">
                        <button className="rsvp-lookup__btn" onClick={next}>Next</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
