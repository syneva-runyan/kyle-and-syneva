import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { partyMemberType } from "./Questionaire";
import "./StayingOnsite.css";
import { FAQInterface, QAndAInterface, Question, qAnda } from "../../blocks/FAQ";

export default function StayingOnsite({ partyMembers, setRSVP } : { partyMembers: partyMemberType[], setRSVP: (partyMemberIndex: number, field: string, value: any) => void  }) {
    let lodgingFaQs : QAndAInterface[] = [];
    qAnda.forEach(({category, questions }: FAQInterface) => {
        if( category == "lodging") {
            lodgingFaQs = [...questions.filter((question: QAndAInterface) => !question.exludeFromRsvp) ]
        }
    })

    const onChange = function(e: any) {
        //set response for all guests attending
        partyMembers.forEach(({ attending }: partyMemberType, index: number) => {
            if(attending) {
                setRSVP(index, "stayingOnsite", e.target.value == "yes")
            }
        });
    }

    return (
        <div>
            <p>Are you planning on staying at Hawkesdene during the wedding weekend?</p>
            <p><span>There are limited lodging options near the venue so all guests are encouraged to stay onpremise</span></p>
            <Accordion>
                <AccordionItem className="questionaire__accordion" header="Questions about lodging?">
                    {lodgingFaQs.map((q: QAndAInterface) => <Question faq={q} key={q.question} />)}
                </ AccordionItem>
            </Accordion>
            <div className="stayingOnsite__radio" radioGroup="staying-on-site">
                <div>
                    <input  aria-checked="false"  type="radio" id="on-site-yes" name="staying-on-site" value="yes" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-yes">Yes</label>
                </div>
                <div>
                    <input aria-checked="false"  type="radio" id="on-site-no" name="staying-on-site" value="no" onChange={onChange} />
                    <label tabIndex={0} htmlFor="on-site-no">No</label>
                </div>
            </div>
        </div>
    )
}