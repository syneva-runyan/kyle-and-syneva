import { guestInfoType, partyMemberType } from "./Questionaire";
import "./Confirmation.css";

export default function({ guestResponses } : {guestResponses: guestInfoType}) {
    const attending: string[] = [];
    const declined: string[] = [];
    
    guestResponses?.partyMembers.forEach((guest: partyMemberType) => {
        if (guest.attending) {
            attending.push(guest.name)
        } else {
            declined.push(guest.name)
        }
    })

    return (
        <div className="contentContainer">
            <p>Thank you for your RSVP! We can't wait to see you at the wedding!</p>
            <div className="confirmation__details">
                <p>
                    {attending.map((name, index) => {
                        let stringEnd = "";
                        if (attending.length > 2 && index < attending.length) {
                            stringEnd = ", "
                        } 
                        if (attending.length > 1 && index == attending.length - 2) {
                            stringEnd = "and "
                        }
                        return `${name} ${stringEnd}`
                    })} will be there!
                </p>
                <p>
                    {declined.map((name, index) => {
                            let stringEnd = "";
                            if (declined.length > 2 && index < declined.length) {
                                stringEnd = ", "
                            } 
                            if (declined.length > 1 && index == declined.length - 1) {
                                stringEnd = "and "
                            }
                            return `${name} ${stringEnd}`
                        })} sadly will not be attending.
                </p>
            </div>
            <span className="backgroundFlower3" />
        </div>
    )
}