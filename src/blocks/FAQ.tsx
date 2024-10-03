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
    question: "Where to stay?",
    answer: "Luxury accommodations and meals will be available at Hawkedene Estate for the weekend of the wedding."
},
{
    question: "How much do on-site accomodations cost?",
    answer: "A room on-site costs $200/party for the weekend or $100/party if you're staying only Saturday. This is inclusive of the room + meals and snacks while on-site. We have subsidized the room costs to encourage attandance 😊"
}, 
{
    question: "What do the accomodations looks like?",
    answer: "You can read more about and see pictures of the accomodations on <a href=\"https://www.hawkesdene.com/accommodations/\" target=\"__blank\" rel=\"noopener noreferrer\">Hawesdene's website</a>. Syneva and Kyle are in-charge of assigning parties to rooms or cabins."
},
{
    exludeFromRsvp: "true",
    question: "How do I reserve a room?",
    answer: "You will be asked about on-site accomodations and prompted to pay when RSVP'ing - <a href=\"/rsvp\">RSVP early</a> to reserve a room."
},
{
    question: "Do I have to stay on-site?",
    answer: "No, but accomdations in the area are limited.  We strongly recommend staying on-site."
}],
}, {
    category: "general",
    questions: [
    {
    question: "How do I get to Hawkesdene?",
    answer: "If coming from out of town, we recommend flying into Atlanta then driving.  The drive is about 2 and a half hours with no traffic."
}, {
    question: "Are kids invited?",
    answer: "Kids are welcome to come! We just ask that during the ceremony and reception they stay with a local babysitter, which we'll provide on-site.  Make sure to RSVP if you're bringing kids so we can accomodate."
}, {
    question: "What if I can only come for part of the weekend?",
    answer: "We don't expect everyone to make the whole weekend and will be happy to see you at all! Just include your plans in the RSVP.",
}, {
    question: "Will there be llamas?",
    answer: "Yes. Be excited.",
},
{
    question: "Can I pet the llamas?",
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
