import { useState } from "react";
// import "./Lookup.css";
import { LookupResponse, lookup } from "../../api/lookup";
// import type { LookupResponse } from "../../api/lookup";

export default function Lookup({ setGuestInfo }: { setGuestInfo: React.Dispatch<React.SetStateAction<any>> }) {
    const [ isError, setIsError] = useState<boolean>(false);
    const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
    const [addressee, setAddressee] = useState("");
    const [suggestion, setSuggestion] = useState({ name: "", partyMembers: "" });

    const onSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        lookupRSVP(addressee);
    }

    const handleError = () => {
        setIsError(true);
        setIsLookingUp(false);
    }

    const lookupRSVP = async (addressee: string) => {
        setIsLookingUp(true);
        setIsError(false);
        try {
             const invite: LookupResponse = await lookup(addressee);
            setIsLookingUp(false);
            if (invite?.guestData?.match) {
                setGuestInfo(invite.guestData.match);
            } else if (invite?.guestData?.suggestion) {
                // @ts-ignore
                setSuggestion(invite.guestData.suggestion);
            }
        } catch(e) {
            handleError();
            return;
        }
    }

    const onAddresseeChange = (value: string) => {
        setAddressee(value)

        if (value == "") {
            setSuggestion({ name: "", partyMembers: "" })
        }
    }


    return (
        <div className="rsvp-lookup">
            <form className="rsvp-lookup__form" onSubmit={onSubmit}>
                <div className="rsvp-lookup__inputs">
                    <div className="floating-label">
                        <input id="first-name" placeholder="&nbsp;Party Name" value={addressee} onChange={(e) => onAddresseeChange(e.target.value)} />
                        <label
                            htmlFor="first-name">Party Name</label>
                        <span className="rsvp-lookup__helper">
                            {isError && <p>Uh oh! Something went wrong - please try again.</p>}
                            {suggestion?.name ?
                                <span>Did you mean{" "}
                                    <button
                                        type="button"
                                        className="rsvp-lookup__suggestion asside"
                                        onClick={() => {
                                            setGuestInfo(suggestion)
                                        }}
                                        disabled={isLookingUp}
                                    >
                                        {suggestion.name}
                                    </button>?</span> : 'Use the name on your invitation\'s envelope, ex "Mr. Tony Soprano"'}
                        </span>
                    </div>
                </div>
                <button className="rsvp-lookup__btn" type="submit">{isLookingUp ? "Searching..." : "Lookup Your Information"}</button>
            </form>
        </div>
    )
}