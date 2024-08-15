import "./FAQ.css";

interface FAQInterface {
    question: string;
    answer: string;
  }

const qAnda= [{
    question: "Where to stay?",
    answer: "Luxury accommodations and meals will be available at Hawkedene Estate for the weekend of the wedding. More details coming soon."
}, 
    {
    question: "How do I get to Hawkesdene?",
    answer: "If coming from out of town, we recommend flying into Atlanta.  We're considering providing transportation from Atlanta to Hawkesdene Thursday & Friday evenings then back to Atlanta Sunday. Come back here for more details soon."
}, {
    question: "Are kids invited?",
    answer: "Kids are welcome at all weekend events except the ceremony and reception, during which we'll provide childcare (local babysitters).  Please make sure to RSVP if you're bringing kids so we can accomodate."
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
}]

function Question({ faq } : { faq: FAQInterface }) {
    return (
        <section>
            <p className="question">{faq.question}</p>
            <p>{faq.answer}</p>
        </section>
    )
}


function FAQ() {
    return (
        <div className="home">
            <header className="homeHeader">
                <h1 className="homeTitleText">Questions?</h1>
            </header>
            <>
                {
                    qAnda.map((el: FAQInterface) => {
                        return <Question key={el.question} faq={el} />;
                    })
                }
            </>
        </div>
    );
}

export default FAQ;
