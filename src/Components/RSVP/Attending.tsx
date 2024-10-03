import { partyMemberType, guestInfoType } from './Questionaire';

export default function Attending(
    { guestRSVP, setRSVP }: { guestRSVP: guestInfoType, setRSVP: (partyMemberIndex: number, field: string, value: any) => void }) {
    
    const attendingFieldName = "attending";
    const attendingValue = {
        "true": "attending",
        "false": "not"
    }
    return (
        <div className="guestAttendingContainer">
        <label>
            <p>Attendance</p>
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
            {guestRSVP.partyMembers.filter(person => !person.isAdult).length > 0 && <p className="asside asside--noTop">Kids are welcome to come!  We just ask that during the ceremony and reception they stay with a local babysitter, which we'll provide on-site. </p>}
        </label>
    </div>
    )
}