import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { saveResponse } from './api';

import './Questionaire.css';

function GuestDetails({ guestsAttending }) {
    return (
        <>
            <h4 className="guestDetailsHeader">Food</h4>
            <p className="helper-text guestDetailsHelper">For each guest, please select an entrée</p>
            {
                [...Array(parseInt(guestsAttending)).keys()].map(i => (
                    <div className="guest_details" key={`guest-details${i + 1}`}>
                        <div className="floating-label guestName">
                            <input name={`guest${i + 1}Name`} placeholder={`Guest ${i + 1} Name`} />
                            <label htmlFor={`guest${i + 1}Name`}>Guest {i + 1} Name</label>
                        </div>
                        { /** Food */}
                        <input className="guestRadio"  type="radio" id="Chicken" name={`guest${i + 1}Food`}  value="Chicken" />
                        <label className="guestRadioLabel" htmlFor="Chicken">Chicken</label>
                        <input className="guestRadio" type="radio" id="Vegetarian" name={`guest${i + 1}Food`}  value="Vegetarian"/>
                        <label className="guestRadioLabel" htmlFor="Vegetarian">Vegetarian</label>
                        <input className="guestRadio" type="radio" id="Beef" name={`guest${i + 1}Food`}  value="Beef" />
                        <label className="guestRadioLabel" htmlFor="Beef">Beef</label>
                    </div>
                )
                ) 
            }
        </>
    )
}

export default function Questionaire({ guestInfo, setGuestResponses }) {
    const [formErrors, setErrors] = useState([]);
    const [guestsAttending, setGuestsAttending] = useState(parseInt(guestInfo[4]));
    const history = useHistory();
    const formEl = useRef(null);

    const decline = async (e) => {
        e.preventDefault();
        const guestName = guestInfo[2] && guestInfo[2].replace("&", "and");
        await saveResponse({
            guestName,
            attending: false,
        });
        history.push("/rsvp/decline-confirmation");
    }

    const getData = () => {
        var object = {};
        const formData = new FormData(formEl.current);
        formData.forEach(function(value, key){
            object[key] = value;
        });
        return object;
    }

    const isValid = data => {
        let errors = [];
        Object.keys(data).forEach(key => {
            if(data[key] === "" || data[key] == null) {
                errors.push(key);
            }
        });

        return errors;
    }

    const accept = async (e) => {
        e.preventDefault();
        if(formEl.current) {
            const data = getData();
            const errors = isValid(data);
            if(errors.length === 0) {
                setGuestResponses(data);
                const guestName = guestInfo[2] && guestInfo[2].replace("&", "and");
                await saveResponse({
                    guestName,
                    attending: true,
                    ...data,
                });
            } else {
                setErrors(errors);
                return;
            }
        }
        history.push("/rsvp/accept-confirmation");
    }
    return (
        <div className="questionaire">
            <h3>{guestInfo[2]}</h3>
            <form ref={formEl}>
                <div className="guestAttendingContainer">
                    <label htmlFor="guestsAttending">
                        Guests attending (including yourself)
                    </label>
                    <select className="select" value={guestsAttending} name="guestsAttending" onChange={(e) => { 
                        setGuestsAttending(e.target.value);
                        setErrors([]);
                    }}>
                        {([...Array(parseInt(guestInfo[4]) + 1).keys() ]).map(i => (
                            <option value={i} key={i}>{i}</option>
                        ))}
                    </select>
                </div>
                {parseInt(guestsAttending) > 0 && <GuestDetails guestsAttending={guestsAttending} />}
                {formErrors.length > 0 ? <p class="error">Please answer all questions.</p> : null}
                <div className="guestDetailsCTAs">
                    <div className="declineBtn">
                        <button className="rsvp-lookup__btn" type="submit" onClick={decline}>Decline</button>
                        <p className="helper-text">with regrets</p>
                    </div>
                    {parseInt(guestsAttending) > 0 && 
                        <div className="acceptBtn">
                            <button className="rsvp-lookup__btn" type="submit" onClick={accept}>Accept</button>
                            <p className="helper-text">with pleasure</p>
                        </div>
                    }
                </div>
            </form>
        </div>
    );
}
