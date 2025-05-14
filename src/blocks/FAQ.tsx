import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import "./FAQ.css";

export interface QAndAInterface {
    exludeFromRsvp?: string;
    question: string;
    answer: string;
}

export interface FAQInterface {
    category: string;
    questions: QAndAInterface[];
  }

export const qAnda= [{
category: "lodging",
questions: [{
    exludeFromRsvp: "true",
    question: "How do I find my room?",
    answer: "At check-in, come to the main house. We'll have room information and maps available. Alternatively, we plan on making this information available on the website before the wedding. Check back here for updates."
}, 
{
    question: "What do the accomodations looks like?",
    answer: "You can read more about and see pictures of the accomodations on <a href=\"https://www.hawkesdene.com/accommodations/\" target=\"__blank\" rel=\"noopener noreferrer\">Hawesdene's website</a>. Specific rooms or cabins aren't guaranteed but can be requested."
}],
}, {
    category: "general",
    questions: [
    {
    question: "How do I get to Hawkesdene?",
    answer: "If coming from out of town, we recommend flying into Atlanta then driving.  The drive is about 2 and a half hours with no traffic."
}, {
    question: "Where do I need to be when, and what are we doing during the weekend?",
    answer: "There is a weekend itinerary on the <a href=\"/#itinerary\">home page</a> - Note that exact details and times are subject to change."
}, {
    question: "Are kids invited?",
    answer: "Kids are welcome to come! We just ask that during the ceremony and reception they stay with a local babysitter, which we'll provide on-site.  Make sure to RSVP if you're bringing kids so we can accomodate."
}, {
    question: "What is the dress code for the wedding?",
    answer: "Semi-formal attire",
}, {
    question: "Will there be alpacas?",
    answer: "Yes. Be excited.",
},
{
    question: "Can I pet the alpacas?",
    answer: "We're working on it.",
}],
}]

export function Question({ faq } : { faq: QAndAInterface }) {
    return (
        <section>
            <p className="question">{faq.question}</p>
            <p dangerouslySetInnerHTML={{__html: faq.answer }} />
        </section>
    )
}


function FAQ() {
    return (
        <div className="home">
            <header className="homeHeader">
                <h1 className="homeTitleText">Questions?</h1>
            </header>
            <Accordion>
                {
                    qAnda.map((el: FAQInterface) => {
                        if (el.category !== "general") {
                            return (
                                <AccordionItem key={el.category} className="faq__accordion" header={`Questions about ${el.category}?`}>
                                    {
                                        el.questions.map((qnaEntry: QAndAInterface) =>
                                            <Question key={qnaEntry.question} faq={qnaEntry} />
                                        )
                                    }
                                </AccordionItem>
                            );
                        } 
                        return (
                            el.questions.map((qnaEntry: QAndAInterface) =>
                                <Question key={qnaEntry.question} faq={qnaEntry} />
                            )
                        )
                    })
                }
            </Accordion>
        </div>
    );
}

export default FAQ;
