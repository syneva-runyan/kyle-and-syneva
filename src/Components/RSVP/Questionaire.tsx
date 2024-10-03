import { useState, useRef } from "react";
import Modal from 'react-modal';

import saveResponse from "../../api/save-response";

import './Questionaire.css';
import Attending from './Attending'
import ResponseDetails from "./ResponseDetails";
import StayingOnsite from "./StayingOnsite";

Modal.setAppElement('#root');

export interface partyMemberType {
    name: string,
    isAdult: boolean,
    attending: boolean,
    eventsAttending: {
        "Thursday evening dinner and event": boolean,
        "Friday afternoon lunch and activity": boolean,
        "Friday evening and activity dinner": boolean,
        "Saturday wedding and reception": boolean
    },
    foodPreferences: string,
    stayingOnsite: "no" | "yes-sat" | "yes-thur-sat" | "yes-fri-sat" | null,
}

export interface guestInfoType {
    name: string,
    partyMembers: partyMemberType[]
 }

 interface ErrorType {
    msg: string,
    confirmation?: string | undefined,
    declination?: string | undefined,
    confirmationFn?: () => void | undefined,
    declinationFn?: () => void | undefined,
 }

function getSubmitCTAText(isSaving: boolean, isOnFinalQuestion: boolean) : string {
    if(isSaving) {
        return "Saving...";
    }
    return isOnFinalQuestion ? "Submit" : "Next";
}

export default function Questionaire({ guestInfo, onConfirmation }: { guestInfo: guestInfoType, onConfirmation: (guestRSVP: guestInfoType) => void }) {
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<ErrorType | null>(null);
    const [finalConfirmation, setFinalConfirmation] = useState(true)
    const [questionIndex, setQuestionIndex] = useState(0);
    const [guestRSVP, setGuestRSVP] = useState({ ...guestInfo });

    const formEl = useRef(null);

    function validateResponseDetails(partyMembers: partyMemberType[]): ErrorType[] {
        const errors: ErrorType[] = [];
        partyMembers.forEach((partyMember: partyMemberType, partyMemberIndex: number) => {
            if(partyMember.attending) {
                for (let event of Object.keys(partyMember.eventsAttending)) {
                    if (partyMember.eventsAttending[event]) {
                        return true
                    }
                }
                errors.push({
                    msg: `You specified that ${partyMember.name} was attending, but didn't select any events. Would you like to change their RSVP to  not attending?`,
                    confirmation: `Set RSVP to not attending`,
                    declination: "No, I'll make a selction",
                    confirmationFn: () => {
                        setRSVP(partyMemberIndex, "attending", false);

                        if(partyMembers.filter(partyMember => partyMember.attending).length == 0) {
                            confirm();
                        }
                    }
                });
            }
        })

        return errors;
    }

    const back = async (e) => {
        e.preventDefault();
        setQuestionIndex(questionIndex - 1);
    }
    const next = async (e) => {
        e.preventDefault();

        if (questionIndex == 1) {
            const errors = validateResponseDetails(guestRSVP.partyMembers);
            if (errors.length > 0) {
                setErrorMsg(errors[0]);
                return;
            }
        }
        const isSuccess = await saveResponseDetails(guestRSVP);
        if(isSuccess) setQuestionIndex(questionIndex + 1);
    }

    const setRSVP = (partyMemberIndex: number, field: string, value: any) => {
        const updatedResponse = { ...guestRSVP };
        // @ts-ignore
        updatedResponse.partyMembers[partyMemberIndex][field] = value
        setGuestRSVP(updatedResponse);
    }

    async function saveResponseDetails(guestRSVP: guestInfoType) {
        if(isSaving) {
            return;
        }
        let isSuccess = false;
        setIsSaving(true);
        try {
            const response = await saveResponse(guestRSVP);
            if(response.success !== "ok") {
                setErrorMsg({ msg: "There was a problem saving your RSVP - please try to submit again."});
            } else {
                isSuccess = true;
            }
        } catch(e) {
            setErrorMsg({ msg: "There was a problem saving your RSVP - please try to submit again."});
        }
        setIsSaving(false);
        return isSuccess;
    }
    

    function getQuestion(questionIndex: number){
        switch (questionIndex) {
            case 0:
                return <Attending guestRSVP={guestRSVP} setRSVP={setRSVP} />
            case 1:
                return <ResponseDetails partyMembers={guestRSVP.partyMembers} setRSVP={setRSVP} />
            case 2:
                return <StayingOnsite finalConfirmation={finalConfirmation} partyMembers={guestRSVP.partyMembers} setRSVP={setRSVP} setFinalConfirmation={setFinalConfirmation} />
            default:
                <Attending guestRSVP={guestRSVP} setRSVP={setRSVP} />;
        }
    }

    async function confirm() {
        const isSuccess = await saveResponseDetails({...guestRSVP, finishedRSVP: true });
        if(isSuccess) onConfirmation(guestRSVP);
    }

    function isFinalQuestion() {
        // final question is last in form or all guest have declined the wedding.
        if(questionIndex == 2) {
            return true
        }
        for(let guest of guestRSVP.partyMembers) {
            if(guest.attending) return false; // still have some questions to go.
        }
        return true;
    }

    function getButonIsDisabled() {
        if (isSaving) {
            return true;
        }
        if(questionIndex == 2 && !finalConfirmation) {
            return true;
        }
        return false;
    }   

    return (
        <div className="questionaire">
            <Modal
                isOpen={errorMsg !== null}
                onRequestClose={() => setErrorMsg(null)}
                contentLabel="Uh oh!"
                style={{ content: {"height": "fit-content"}}}
            >
                <h2>Oh no!</h2>
                <p>{errorMsg?.msg}</p>
                {
                    errorMsg?.declination && <button 
                            className="rsvp-lookup__btn error__declination"
                            onClick={() => setErrorMsg(null)}
                        >{errorMsg?.declination}</button>
                }
                <button 
                            className="rsvp-lookup__btn error__confirmation"
                            onClick={() => {
                                if(errorMsg?.confirmationFn) {
                                    errorMsg.confirmationFn();
                                }
                                setErrorMsg(null)
                            }
                            }
                        >{errorMsg?.confirmation || "Ok"}</button>
            </Modal>
            <h3>{guestInfo.name}</h3>
            <form ref={formEl}>
                {getQuestion(questionIndex)}
                <div className="guestDetailsCTAs">
                    <div className="">
                        { questionIndex > 0 && <button className="rsvp-lookup__btn" onClick={back}>Back</button> }
                    </div>
                    <div>
                        <button 
                            className="rsvp-lookup__btn primaryButton"
                            onClick={isFinalQuestion() ? confirm : next}
                            disabled={getButonIsDisabled()}
                        >
                                {getSubmitCTAText(isSaving, isFinalQuestion())}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
