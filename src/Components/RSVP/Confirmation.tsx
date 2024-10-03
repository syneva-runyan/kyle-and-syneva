import { useState } from "react";
import { guestInfoType, partyMemberType } from "./Questionaire";
import "./Confirmation.css";
import sendCommentOrQuestion, { commentOrQuestionReturnObject } from "../../api/comment-or-question";

export default function({ guestResponses } : {guestResponses: guestInfoType}) {
    const [isLookingUp, setIsLookingUp] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
    const [additionalCommentsOrQuestions, setAdditionalCommentsOrQuestions] = useState<string>("");
    const attending: string[] = [];
    const declined: string[] = [];
    
    guestResponses?.partyMembers.forEach((guest: partyMemberType) => {
        if (guest.attending) {
            attending.push(guest.name)
        } else {
            declined.push(guest.name)
        }
    })

    const setCommentOrQuestion = (e: any) => {
        e.preventDefault();
        setAdditionalCommentsOrQuestions(e.target.value)
    }

    const submit = async (e: any) => {
        e.preventDefault();
        setIsLookingUp(true);
        setIsError(false);
        setIsSuccess(false);
        try {
            const resp: commentOrQuestionReturnObject = await sendCommentOrQuestion({
                from: guestResponses?.name,
                body: additionalCommentsOrQuestions
            });
            setIsLookingUp(false);
            if (resp?.success == "ok") {
                setIsSuccess(true)
                setAdditionalCommentsOrQuestions("");
            }
        } catch(e) {
            setIsLookingUp(false);
            setIsError(true);
            return;
        }
    };
    

    return (
        <div className="contentContainer">
            <p className="confirmation__details">Thank you for your RSVP{attending.length > 0 && " - we can't wait to see you at the wedding!"}</p>
            <div>
            {attending.length > 0 &&
                (<p className="confirmation__yes">
                    {attending.map((name, index) => {
                        let stringEnd = "";
                        if (attending.length > 2 && index < attending.length - 1) {
                            stringEnd = ", "
                        } 
                        if (attending.length > 1 && index == attending.length - 2) {
                            stringEnd = " and "
                        }
                        return `${name}${stringEnd}`
                    })} will be there!
                </p>)}
                <p>
                    {declined.map((name, index) => {
                            let stringEnd = "";
                            if (declined.length > 2 && index < declined.length) {
                                stringEnd = ", "
                            } 
                            if (declined.length > 1 && index == declined.length - 2) {
                                stringEnd = "and "
                            }
                            return `${name} ${stringEnd}`
                        })} { declined.length > 0 && "sadly will not be attending." }
                </p>
            </div>  
            <form onSubmit={submit}>
                <label htmlFor="additional-questions">Comments or questions? Don't hesitate to reach out!</label><br/>
                <textarea className="confirmation__additional-questions" id="additional-questions" onChange={setCommentOrQuestion} value={additionalCommentsOrQuestions} /><br/>
                {isError && <p className="error confirmation__error">Uh oh! Something went wrong - please try again.</p>}
                {isSuccess && <p className="confirmation__success">Thank you for your message! We'll get back to you as soon as we can.</p>}
                <button disabled={additionalCommentsOrQuestions === "" || isLookingUp} type="submit" className="confirmation__form rsvp-lookup__btn primaryBtn">
                    {isLookingUp ? "Sending..." : "Submit" }
                </button>
            </form>
        </div>
    )
}