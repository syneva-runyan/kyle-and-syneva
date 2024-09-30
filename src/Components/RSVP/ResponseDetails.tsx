import { partyMemberType } from "./Questionaire";
import { WeddingWeekendText } from "../WeddingWeekend";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';

import "./ResponseDetails.css";


export default function ResponseDetails({ partyMembers, setRSVP } : { partyMembers: partyMemberType[], setRSVP: (partyMemberIndex: number, field: string, value: any) => void  }) {
    const foodAllergiesKeyName = "foodPreferences";
    const attendingEvent = (eventsAttending: any, eventName: string, partyMemberIndex: number) => {
        const updatedEvents = {
            ...eventsAttending,
        }
        updatedEvents[eventName] = !updatedEvents[eventName];
        setRSVP(partyMemberIndex, "eventsAttending", updatedEvents)
    };

    const attendingAllEvents = (eventsAttending: any, partyMemberIndex: number) => {
        const updatedEvents = {};
        Object.keys(eventsAttending).forEach((eventName: string) => updatedEvents[eventName] = true)
        setRSVP(partyMemberIndex, "eventsAttending", updatedEvents)
    };

    function getEventName(eventName: string, isAdult: boolean) {
        if(eventName.includes("wedding") && !isAdult) {
            return "Kids party during wedding & reception (local babysitter on-site)";
        }
        return eventName;
    }

    return (
        <div>
            <Accordion>
                <AccordionItem className="questionaire__accordion" header="Questions about Thursday?">
                    <WeddingWeekendText />
                </ AccordionItem>
            </Accordion>
            { partyMembers.map(({ attending, name, eventsAttending, foodPreferences, isAdult } : partyMemberType, partyMemberIndex: number) => {
                if(!attending) {
                    return null;
                }
                const setFoodPreference = (preference: string) => {
                    setRSVP(partyMemberIndex, foodAllergiesKeyName, preference);
                }
                return (
                    <div className="guestAttendingContainer" key={name}>
                        <p>Select the events {name} will be attending</p>
                            <button className="rsvp-lookup__btn responseDetails__attendingAll" onClick={(e) => {
                                e.preventDefault();
                                attendingAllEvents(eventsAttending, partyMemberIndex)
                            }}
                            >
                                Attending all events
                            </button>
                            {
                                Object.keys(eventsAttending).map((eventName: string, eventIndex: number) => {
                                    const onKeyDown = (e: any) => {
                                        if (e.code === "Enter") {
                                            attendingEvent(eventsAttending, eventName, partyMemberIndex);
                                        }
                                    }
                                    return (
                                        <div key={`${eventIndex}${name.replace(" ", "")}${eventName}`}>
                                            <input 
                                                type="checkbox" 
                                                id={`guest${name.replace(" ", "")}${eventIndex}eventAttendance`} 
                                                name={eventName} 
                                                checked={eventsAttending[eventName]}
                                                onChange={() => attendingEvent(eventsAttending, eventName, partyMemberIndex)}
                                            />
                                            <label 
                                                onKeyDown={e => onKeyDown(e)}
                                                tabIndex={0}
                                                htmlFor={`guest${name.replace(" ", "")}${eventIndex}eventAttendance`}
                                            >
                                                    {getEventName(eventName, isAdult)}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        <div>
                            <label className="questionaire__foodlabel" htmlFor={`guest${partyMemberIndex}FoodAllergies`}>Any dietary restrictions or preferences?</label><br></br>
                            <textarea 
                                id={`guest${partyMemberIndex}FoodAllergies`} 
                                name={foodAllergiesKeyName} 
                                value={foodPreferences}
                                onChange={ e => setFoodPreference(e.target.value)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}