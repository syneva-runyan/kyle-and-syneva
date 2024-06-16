import { useState } from "react";
import "./Lookup.css";
import { lookup } from "./api";

import './styles.css';

export default function Lookup() {
    const [addressee, setAddressee] = useState("");
    const [suggestion, setSuggestion] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        lookupRSVP(addressee);
    }

    const lookupRSVP = async (addressee : string) => {
        const invite = await lookup(addressee);
        console.log(invite);
        // if (invite && invite.guestData) {
        //     if(invite.guestData.match) {
        //         setGuestInfo(invite.guestData.match);
        //     } else if(invite.guestData.suggestion) {
        //         setSuggestion(invite.guestData.suggestion[2]);
        //     }
        // }
    }

    const onAddresseeChange = (value : string) => {
        setAddressee(value)
    }

    const lookupSuggestion = (addressee : string) => {
        lookupRSVP(addressee);
    }


    return (
        <div className="rsvp-lookup">
            <h1>RSVP</h1>
            <h4> Search for your invitation</h4>
            <form className="rsvp-lookup__form" onSubmit={onSubmit}>
                <div className="rsvp-lookup__inputs">
                    <div className="floating-label">
                        <input id="first-name" placeholder="&nbsp;Invitation Addressee" value={addressee} onChange={ (e) => onAddresseeChange(e.target.value)} />
                        <label 
                            htmlFor="first-name">Invitation Addressee</label>
                    <span className="rsvp-lookup__helper">
                        {suggestion ?
                            <span>Did you mean 
                            <button 
                                className="rsvp-lookup__suggestion" 
                                onClick={ () => lookupSuggestion(addressee)}
                            >
                                {suggestion}
                            </button>?</span> : 'Use the name on your invitation\'s envelope, ex "Mr. Tony Soprano"'}
                    </span>
                    </div>
                </div>
                <button className="rsvp-lookup__btn" type="submit" onClick={lookupRSVP}>Lookup Invitation</button>
            </form>
        </div>
    )
}