import { guestInfoType } from '../RSVP/Questionaire';

function YourWeekend({ guestInfo, searchAnotherParty }: { guestInfo: guestInfoType, searchAnotherParty: any }) {
    return (
        <div className='weddingInfo'>
            <h2>{guestInfo.name}</h2>
            <p>
                <strong>Room Assignment</strong><br/>
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
