import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import { guestInfoType } from '../RSVP/Questionaire';
import "./YourWeekend.css";
import { useEffect } from 'react';

function YourWeekend({ guestInfo, searchAnotherParty }: { guestInfo: guestInfoType, searchAnotherParty: any }) {

    useEffect(() => {
        document.body.className = "yourWeekend";
    }, [])

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

    const isAirbnb = (lodging?: string | null) => {
        return lodging?.toLowerCase().replaceAll(" ", "").indexOf("airbnb") !== -1;
    }

    const isMainHouse = (lodging?: string | null) => {
        return lodging?.toLowerCase().indexOf("main") !== -1;
    }

    const cleanLodgingAssignment = (lodging?: string | null) => {
        const readableName = lodging?.replaceAll(" ", "").replace(",", "").replace(".","");
        if (readableName.indexOf("MainHouse") !== -1) {
            return "MainHouse";
        }

        if (readableName.indexOf("HawkesviewCottage2") !== -1) {
            return "HawkesviewCottage2";
        }

        if (readableName.indexOf("HawkesviewCottage1") !== -1) {
            return "HawkesviewCottage1";
        }

        if (readableName.indexOf("Blackberry") !== -1) {
            return "Blackberry";
        }

        if (readableName.indexOf("PhillipsHouse") !== -1) {
            return "PhillipsHouse";
        }
        return readableName;
    }
    return (
        <div className='weddingInfo'>
            <h2>{guestInfo.name}</h2>
            <Accordion>
                <AccordionItem className="yourWeekend_welcomeLetterCTA" header={"Read A Note From Us"}>
                    Dear {addressee},<br/><br/>
                    We are thrilled you're here with us this weekend and want to let you know just how much your presence means to us. Alaska is an incredible place, but beacuse we live so far away, we don’t get to see the people we love as often as we’d like. Having ya'll here with us for our wedding is a gift that we will cherish forever.
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
            <div className={`yourWeekend_cottage detailsFor${cleanLodgingAssignment(guestInfo.partyMembers[0].lodgingAssignment)}`}>
                <p className="content">
                    <strong>Room For the Weekend</strong><br/>
                    <span className='yourDetails'>{guestInfo.partyMembers[0].lodgingAssignment || "Check back here again soon!"} </span>
                </p>
                { !isAirbnb(guestInfo.partyMembers[0].lodgingAssignment) &&
                    <Accordion>
                        <AccordionItem header={"View Cottage on Map"}>
                            <p className="tableCaption"><em>Cottage designated in white{ !isMainHouse(guestInfo.partyMembers[0].lodgingAssignment) && <span className='mainCottageLegend'>. Main house shown in blue.</span> }</em></p>
                            <p className="mobileHelper tableCaption">View in desktop mode for larger map.</p>
                            <div className="tableWrapper">
                                <img className={`tableMap mapFor${cleanLodgingAssignment(guestInfo.partyMembers[0].lodgingAssignment)}`} src="src/assets/groundsMap.jpg" alt="Reception Table Map" />
                                <span className="cottageMarker cottageMain" />
                                <span className={`cottageMarker cottage${cleanLodgingAssignment(guestInfo.partyMembers[0].lodgingAssignment)}`} />
                            </div>
                        </AccordionItem>
                    </Accordion>
                }
            </div>
            <div className="yourWeekend_receptionBlock">
                <p className='content'>
                    <strong>Reception Table</strong><br/>
                    <span className='yourDetails'>{guestInfo.partyMembers[0].receptionTable ||  "Check back here again soon!" }</span>
                </p>
                <Accordion>
                    <AccordionItem header={"View Table on Map"}>
                        <p className="tableCaption"><em>Table designated in white</em></p>
                        <div className='tableWrapper'>
                            <img className="tableMap" src="src/assets/weddingTables.png" alt="Reception Table Map" />
                            <span className={`tableMarker table${guestInfo.partyMembers[0].receptionTable?.replaceAll(" ", "").replace("'", "").replace(".","")}`} />
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
            <button className="rsvp-lookup__btn" onClick={searchAnotherParty}>Search Another Party</button>
        </div>
    );
}

export default YourWeekend;
