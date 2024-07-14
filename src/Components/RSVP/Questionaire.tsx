import React, { useState, useRef } from "react";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';

// import { useHistory } from "react-router-dom";
// import { saveResponse } from './api';

import './Questionaire.css';
import { WeddingWeekendText } from "../WeddingWeekend";

interface partyMemberType {
    name: string,
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

  interface guestInfoType {
   name: string,
   partyMembers: partyMemberType[]
  }
  
  interface guestInfoResponse {
    name: string,
    partyMembers: string[]
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

function Attending(
    { guestRSVP, setRSVP }:
    { guestRSVP: guestInfoType,
        setRSVP: (partyMemberIndex: number, field: string, value: any) => void }) {
    const attendingFieldName = "attending";
    const attendingValue = {
        "true": "attending",
        "false": "not"
    }
    return (
        <div className="guestAttendingContainer">
        <label htmlFor="guestsAttending">
            Attendance
        </label>
            {guestRSVP.partyMembers.map(({name, attending } : partyMemberType, index: number) => (
                <div className="questionaire__guestAttendanace" key={name}>
                    <p>{name}</p>
                    <div className="questionaire__guestResponse">
                        <select
                            className="select"
                            value={attendingValue[attending?.toString() || "true"]}
                            name="guestsAttending" 
                            onChange={(e) => {
                                const attending: boolean = e.target.value == attendingValue["true"] || false;
                                setRSVP(index, attendingFieldName, attending);
                            }}
                        >
                            <option value={attendingValue["true"]}>Attending</option>
                            <option value={attendingValue["false"]}>Sadly Can Not</option>
                        </select>
                    </div>
                </div>
            ))}
            {guestRSVP.partyMembers.length > 2 && <p className="asside asside--noTop">Kids are welcome at all weekend events except the ceremony and reception, during which we'll provide childcare (local babysitters).</p>}
    </div>
    )
}

function GuestResponse({ partyMembers, setRSVP } : { partyMembers: partyMemberType[], setRSVP: (partyMemberIndex: number, field: string, value: any) => void  }) {
    const attending: partyMemberType[] = partyMembers.filter(member => member.attending);
    const foodAllergiesKeyName = "foodPreferences";
    return (
        <div>
            <Accordion>
                <AccordionItem header="Questions about Thursday?">
                    <WeddingWeekendText />
                </ AccordionItem>
            </Accordion>
            { attending.map(({ name, eventsAttending, foodPreferences } : partyMemberType, index: number) => (
                <div className="guestAttendingContainer" key={name}>
                    <p>Select the events {name} will be attending</p>
                        {
                            Object.keys(eventsAttending).map((eventName: string) => (
                                <div key={`${index}${eventName}`}>
                                    <input 
                                        type="checkbox" 
                                        id={`guest${index}eventAttendance`} 
                                        name={eventName} 
                                        value={eventsAttending[eventName]}
                                        onClick={(e) => {
                                            const updatedEvents = {
                                                ...eventsAttending,
                                            }
                                            updatedEvents[eventName] = e.target.value;
                                            setRSVP(index, "eventsAttending", updatedEvents)
                                        }}
                                    />
                                    <label htmlFor={`guest${index}eventAttendance`}>{eventName}</label>
                                </div>
                            ))
                        }
                    <div>
                        <label htmlFor={`guest${index}FoodAllergies`}>Any dietary restrictions or preferences?</label><br></br>
                        <textarea 
                            id={`guest${index}FoodAllergies`} 
                            name={foodAllergiesKeyName} 
                            value={foodPreferences}
                            onChange={(e) => {
                                setRSVP(index, foodAllergiesKeyName, e.target.value)
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Questionaire({ guestInfo }: { guestInfo: guestInfoResponse }) {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [guestRSVP, setGuestRSVP] = useState(
        { ...guestInfo, 
            partyMembers: guestInfo.partyMembers.map((name: string) => (
                { name, ...defaultRSVP }
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
                return <GuestResponse partyMembers={guestRSVP.partyMembers} setRSVP={setRSVP} />
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
                        <button className="rsvp-lookup__btn" onClick={back}>Back</button>
                    </div>
                    <div className="nextBtn">
                        <button className="rsvp-lookup__btn" onClick={next}>Next</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
