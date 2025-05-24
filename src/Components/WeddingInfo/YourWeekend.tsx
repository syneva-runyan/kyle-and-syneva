import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import { guestInfoType } from '../RSVP/Questionaire';
import "./YourWeekend.css";

function YourWeekend({ guestInfo, searchAnotherParty }: { guestInfo: guestInfoType, searchAnotherParty: any }) {
    const addressee = guestInfo.partyMembers.reduce((acc, member, idx) => { 
        const firstName = member.name.split(" ")[0];
        let prefix = ", ";
        if (idx === 0) {
            prefix = " ";
        } else if (idx === guestInfo.partyMembers.length - 1) {
            prefix = " and ";
        }
        return `${acc}${prefix}${firstName}`; 
    }, "").trim();
    return (
        <div className='weddingInfo'>
            <h2>{guestInfo.name}</h2>
            <Accordion>
                <AccordionItem className="yourWeekend_welcomeLetterCTA" header={"A Note From Us"}>
                    Dear {addressee},<br/><br/>
                    We are thrilled you're here with us this weekend, and want to let you know just how much your presence means to us. Alaska is an incredible place, but beacuse we live so far away, we don’t get to see the people we love as often as we’d like. Having ya'll here with us for our wedding is a gift that we will cherish forever.
                    <br/><br/>
                    We hope you enjoy every part of this celebration – the laughter, the dancing, the memories we’ll create together – and that you feel the warmth and love that surrounds us all.
                    <br/><br/>
                    Thank you for being a part of our story. We are so excited to begin this new chapter surrounded by the people we love most.
                    <br/><br/>
                    With love and gratitude,<br/>
                    Kyle and Syneva
                    <br/><br/>
                    <span className="yourWeekend_welcomeLetterPS">PS: When you see our moms this weekend, make sure to compliment and thank them for everything they've done to make this weekend happen - We wouldn't have cake or ibuprofen here without them!</span><br/><br/>
                </AccordionItem>

            </Accordion>
            <p>
                <strong>Room For the Weekend</strong><br/>
                <span>{guestInfo.partyMembers[0].lodgingAssignment || "Check back here again soon!"} </span>
            </p>
            <p>
                <strong>Reception Table</strong><br/>
                <span>{guestInfo.partyMembers[0].receptionTable ||  "Check back here again soon!" }</span>
            </p>
            <button className="rsvp-lookup__btn" onClick={searchAnotherParty}>Search Another Party</button>
        </div>
    );
}

export default YourWeekend;
