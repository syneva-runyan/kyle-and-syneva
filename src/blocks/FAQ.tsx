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
    answer: "At check-in, come to the main house. We'll have room information and maps available. We can also view room information on the <a href='/wedding-info'>your weekend page</a> ahead of time."
}, 
{
    question: "What do the accomodations looks like?",
    answer: "You can read more about and see pictures of the accomodations on <a href=\"https://www.hawkesdene.com/accommodations/\" target=\"__blank\" rel=\"noopener noreferrer\">Hawkesdene's website</a>."
}],
}, {
    category: "photography",
    questions: [{
        question: "Can I take photos during the ceremony?",
        answer: "Please keep your phones off and away during the ceremony - We have an amazing photographer who will be capturing the day and want you to be present and enjoy the moment with us.",
    }, 
    {
        question: "Can I post photos on social media?",
        answer: "Feel free to post tasteful photos online - however we ask that you exclude other parent's children from your posts unless you have explicit permission."
    }, {
        question: "Do you have a wedding hashtag?",
        answer: "No"
    }, {
        question: "How can I share my photos with you?",
        answer: "We have a shared google photo album you can upload any tasteful wedding photos to during or after the weekend! <a href=\"https://photos.app.goo.gl/nty5kHdHcUUpzs1L9\" target=\"__blank\" rel=\"noopener noreferrer\">Click here to upload photos</a>.",
    }], },
{
    category: "general",
    questions: [
    {
    question: "How do I get to Hawkesdene?",
    answer: "If coming from out of town, we recommend flying into Atlanta then driving.  The drive is about 2 and a half hours with no traffic."
}, {
    question: "Where do I need to be when, and what are we doing during the weekend?",
    answer: "There is a weekend itinerary on the <a href=\"/#itinerary\">home page</a> - Plan on arriving at the ceremony 15 minutes before the scheduled start time."
}, {
    question: "Are kids invited?",
    answer: "Kids are welcome to come! We just ask that during the ceremony and reception they stay with a local babysitter, which we'll provide on-site."
}, {
    question: "What is the dress code for the wedding?",
    answer: "Semi-formal attire",
}, {
    question: "What is semi-formal attire?",
    answer: "For men, a suit (with or without a tie) or a nice dress shirt and pants.  For women, a nice dress, suit, or tasteful jumpsuit.",
}, {
    question: "Will there be meal options for guests with dietary restrictions or allergies?",
    answer: "The kitchen is accomodating reasonable requests specified with RSVPs.  You can confirm your meal accomodations on the <a href=\"/wedding-info\" target=\"__blank\" rel=\"noopener noreferrer\">Your Weekend</a> page<br/><br/> Altered meals will be served plated, separate from buffets. We recomend you say hi to the kitchen when you arrive so they know who you are.",
},{
    question: "Will there be a open bar?",
    answer: "Yes - Please enjoy responsibly.",
},{
    question: "Where should I park?",
    answer: "There is a free parking lot on property - look out for signage when you arrive.",
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
