import { useState } from "react";
import { guestInfoType, partyMemberType } from "./Questionaire";
import "./Confirmation.css";

export default function({ guestResponses } : {guestResponses: guestInfoType}) {
    const [additionalCommentsOrQuestions, setAdditionalCommentsOrQuestions] = useState<string>("");
    const attending: string[] = [];
    const declined: string[] = [];
    
    guestResponses?.partyMembers.forEach((guest: partyMemberType) => {
        if (guest.attending) {
            attending.push(guest.name)
        } else {
            declined.push(guest.name)
        }
    })

    const submitQuestions = (e: any) => {
        e.preventDefault();
        setAdditionalCommentsOrQuestions(e.target.value)
    }

    return (
        <div className="contentContainer">
            <p className="confirmation__details">Thank you for your RSVP{attending.length > 0 && " - we can't wait to see you at the wedding!"}</p>
            <div>
            {attending.length > 0 &&
                (<p className="confirmation__yes">
                    {attending.map((name, index) => {
                        let stringEnd = "";
                        if (attending.length > 2 && index < attending.length - 1) {
                            stringEnd = ", "
                        } 
                        if (attending.length > 1 && index == attending.length - 2) {
                            stringEnd = " and "
                        }
                        return `${name}${stringEnd}`
                    })} will be there!
                </p>)}
                <p>
                    {declined.map((name, index) => {
                            let stringEnd = "";
                            if (declined.length > 2 && index < declined.length) {
                                stringEnd = ", "
                            } 
                            if (declined.length > 1 && index == declined.length - 2) {
                                stringEnd = "and "
                            }
                            return `${name} ${stringEnd}`
                        })} { declined.length > 0 && "sadly will not be attending." }
                </p>
            </div>  
            <form>
                <label htmlFor="additional-questions">Comments or questions? Don't hesitate to reach out!</label><br/>
                <textarea id="additional-questions" onChange={submitQuestions} value={additionalCommentsOrQuestions} /><br/>
                <button type="submit" className="confirmation__form rsvp-lookup__btn">Submit</button>
            </form>
        </div>
    )
}