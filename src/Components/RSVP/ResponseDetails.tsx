import { partyMemberType } from "./Questionaire";
import { WeddingWeekendText } from "../WeddingWeekend";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';


export default function ResponseDetails({ partyMembers, setRSVP } : { partyMembers: partyMemberType[], setRSVP: (partyMemberIndex: number, field: string, value: any) => void  }) {
    const attending: partyMemberType[] = partyMembers.filter(member => member.attending);
    const foodAllergiesKeyName = "foodPreferences";
    return (
        <div>
            <Accordion>
                <AccordionItem className="questionaire__accordion" header="Questions about Thursday?">
                    <WeddingWeekendText />
                </ AccordionItem>
            </Accordion>
            { attending.map(({ name, eventsAttending, foodPreferences } : partyMemberType, index: number) => (
                <div className="guestAttendingContainer" key={name}>
                    <p>Select the events {name} will be attending</p>
                        {
                            Object.keys(eventsAttending).map((eventName: string, eventIndex: number) => {
                                const onClick = (eventName: string) => {
                                    const updatedEvents = {
                                        ...eventsAttending,
                                    }
                                    updatedEvents[eventName] = !updatedEvents[eventName];
                                    setRSVP(index, "eventsAttending", updatedEvents)
                                };
                                const onKeyDown = (e: any) => {
                                    if (e.code === "Enter") {
                                        onClick(eventName);
                                    }
                                }
                                return (
                                    <div key={`${eventIndex}${name.replace(" ", "")}${eventName}`}>
                                        <input 
                                            type="checkbox" 
                                            id={`guest${name.replace(" ", "")}${eventIndex}eventAttendance`} 
                                            name={eventName} 
                                            checked={eventsAttending[eventName]}
                                            onChange={() => onClick(eventName)}
                                        />
                                        <label 
                                            onKeyDown={e => onKeyDown(e)}
                                            tabIndex={0}
                                            htmlFor={`guest${name.replace(" ", "")}${eventIndex}eventAttendance`}
                                        >
                                                {eventName}
                                        </label>
                                    </div>
                                )
                            })
                        }
                    <div>
                        <label className="questionaire__foodlabel" htmlFor={`guest${index}FoodAllergies`}>Any dietary restrictions or preferences?</label><br></br>
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