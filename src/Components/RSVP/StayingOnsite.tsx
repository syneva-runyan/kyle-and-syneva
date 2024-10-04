import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { partyMemberType } from "./Questionaire";
import "./StayingOnsite.css";
import { FAQInterface, QAndAInterface, Question, qAnda } from "../../blocks/FAQ";

function getIsPartyStayingOnSite(partyMembers: partyMemberType[]) : "no" | "yes-sat" | "yes-thur-sat" | "yes-fri-sat" {
    for (let partyMember of partyMembers) {
        if (partyMember.attending && partyMember.stayingOnsite) {
            return partyMember.stayingOnsite
        }
    }

    return "no";
}

export default function StayingOnsite({ partyMembers, setRSVP, setFinalConfirmation, finalConfirmation } : { partyMembers: partyMemberType[], setRSVP: (partyMemberIndex: number, field: string, value: any) => void, setFinalConfirmation: (confirmation: boolean) => void, finalConfirmation: boolean  }) {
    let lodgingFaQs : QAndAInterface[] = [];
    const stayingOnsite : "no" | "yes-sat" | "yes-thur-sat" | "yes-fri-sat" = getIsPartyStayingOnSite(partyMembers);
    
    qAnda.forEach(({category, questions }: FAQInterface) => {
        if( category == "lodging") {
            lodgingFaQs = [...questions.filter((question: QAndAInterface) => !question.exludeFromRsvp) ]
        }
    })

    const onChange = function(e: any) {
        if(e.target.value !== "no") {
            setFinalConfirmation(false);
        } else {
            setFinalConfirmation(true);
        }
        //set response for all guests attending
        partyMembers.forEach(({ attending }: partyMemberType, index: number) => {
            if(attending) {
                setRSVP(index, "stayingOnsite", e.target.value)
            }
        });
    }

    return (
        <div>
            <p>Will you be staying at Hawkesdene?</p>
            <Accordion>
                <AccordionItem className="questionaire__accordion" header="Questions about lodging?">
                    {lodgingFaQs.map((q: QAndAInterface) => <Question faq={q} key={q.question} />)}
                </ AccordionItem>
            </Accordion>
            <div className="stayingOnsite__radio" radioGroup="staying-on-site">
                <div>
                    <input checked={stayingOnsite == "yes-thur-sat"} aria-checked="false"  type="radio" id="on-site-yes-thursday-saturday" name="staying-on-site" value="yes-thur-sat" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-yes-thursday-saturday">Yes, Thursday, Friday, and Saturday nights</label>
                </div>
                <div>
                    <input checked={stayingOnsite == "yes-fri-sat"} aria-checked="false"  type="radio" id="on-site-yes-friday-saturday" name="staying-on-site" value="yes-fri-sat" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-yes-friday-saturday">Yes, Friday and Saturday nights</label>
                </div>
                <div>
                    <input checked={stayingOnsite == "yes-sat"} aria-checked="false"  type="radio" id="on-site-yes-saturday" name="staying-on-site" value="yes-sat" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-yes-saturday">Yes, just Saturday night</label>
                </div>
                <div>
                    <input checked={stayingOnsite == "no"} aria-checked="false"  type="radio" id="on-site-no" name="staying-on-site" value="no" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-no">No</label>
                </div>
            </div>
            { stayingOnsite !== "no" && <HowToPay stayingOnsite={stayingOnsite} setFinalConfirmation={setFinalConfirmation} finalConfirmation={finalConfirmation}/> }
        </div>
    )
}

function HowToPay({ stayingOnsite, setFinalConfirmation, finalConfirmation } : { stayingOnsite: "yes-sat" | "yes-thur-sat" | "yes-fri-sat", setFinalConfirmation: (confirmation: boolean) => void, finalConfirmation: boolean  }) {
    return (
        <div>
            <p>To reserve your room, complete the payment form on{" "}
                <a target="blank" rel="noopener noreferrer" href="https://www.hawkesdene.com/guest-payments/">Hawkesdene's website</a>
                {" "}with the following details:</p>
            <ul className="staying-onsite__formDetails">
                <li>
                    Amount to be charged? - "{ (stayingOnsite == "yes-sat") ? "$125" : "$250" }"<br/>
                <span className="staying-onsite__asside"> This amount is inclusive of the party's lodging + food and drinks for the weekend.</span>
                </li>
                <li>Comments and/or Requests - Add any requests for particular rooms or cabins</li>
            </ul>
            <input 
                type="checkbox" 
                id={`payment-confirmation`} 
                name="payment-confirmation"
                onChange={ () => setFinalConfirmation(!finalConfirmation)}
                checked={finalConfirmation}
            />
            <label 
                tabIndex={0}
                htmlFor="payment-confirmation"
            >
                    Check this box to confirm you've paid
            </label>
        </div>
    )
}