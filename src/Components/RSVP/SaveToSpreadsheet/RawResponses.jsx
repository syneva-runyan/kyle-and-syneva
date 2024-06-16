import React, { useState } from "react";

import  './RawResponses.css';

export default function RawResponses({files}) {
    const [revealedGuest, setRevealedGuest] = useState(null);
    
    const revealGuest = (guestName) => {
        setRevealedGuest(guestName);
    }
    return (
        <div className="rawResponses">
            <h4>Guest Responses</h4>
            {!files && <p className="rawResponses__loader">Loading...</p>}
            <ul>
                {files && Object.keys(files).map(fileName => {
                    const data = JSON.parse(files[fileName]);
                    const attending = data.attending === 'true' ? 'Attending' : 'Not Attending';
                    const onClick = () => { revealGuest(data.guestName)}
                    return (
                        <li key={fileName} onClick={onClick}>
                            <p className="rawResponses__header"><button>{data.guestName}</button> ({attending})</p>
                            <p className="rawResponses__details">
                            {
                                data.guestName === revealedGuest && (
                                    Object.keys(data).map(key => {
                                        if (key === 'guestName') {
                                            return null;
                                        }
                                        return (
                                            <>
                                                <span key={`${data.guestName}-${key}`}>{key}: {data[key]}</span> <br></br>
                                            </>
                                        );
                                    }
                                ))
                            }
                            </p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}