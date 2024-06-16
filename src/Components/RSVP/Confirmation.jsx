import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";


export default function({ guestInfo, guestResponses}) {
    const history = useHistory();
    if (!guestInfo || !guestResponses) {
        history.push('/rsvp');
        return null;
    }
    return (
        <div className="contentContainer">
            <p>Thank you for your RSVP! We can't wait to see you at the wedding!</p>
            <div>
                <p style={{marginBottom: 0, fontFamily: 'oregon_ldo_lightregular'}}>{guestInfo[2]}, accepts with pleasure</p>
                <p style={{marginTop: 0, fontFamily: 'oregon_ldo_lightregular'}}>
                    <em>
                    {guestResponses.guestsAttending} Guest{parseInt(guestResponses.guestsAttending) > 1 && "s"}<br/>
                        {[...Array(parseInt(guestResponses.guestsAttending)).keys()].map(j => {
                            const i = j + 1;
                            return (
                                <Fragment key={`guest${i}`}><span>{guestResponses[`guest${i}Food`]} ({guestResponses[`guest${i}Name`]})</span> <br/></Fragment>
                            );
                        })}
                    </em>
                </p>
            </div>
            <span className="backgroundFlower3" />
        </div>
    )
}