import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
const faqs = [
  {
    question: "How does Shortify work?",
    answer: "Simply paste your long URL into the input field and click 'Shorten Link'. Shortify generates a unique, compact URL that redirects to your original link. It's fast, free, and requires no sign-up."
  },
  {
    question: "Do I need an account to use the app?",
    answer: "No! You can shorten links instantly without creating an account. However, signing up gives you access to detailed analytics, custom aliases, and link management features."
  },
  {
    question: "What analytics are available for my shortened URLs?",
    answer: "With an account, you can track total clicks, geographic locations, referral sources, device types, and browser information. All data is displayed in a clean, real-time dashboard."
  },
  {
    question: "Is there a limit to how many links I can shorten?",
    answer: "Free users can shorten up to 50 links per month. Premium users enjoy unlimited link shortening along with advanced analytics and custom branding options."
  }
];
const FAQSection = () => {
  return <section className="py-24 relative">
      <div className="w-full px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => <AccordionItem
    key={i}
    value={`item-${i}`}
    className="glow-card rounded-xl px-6 border-none group/faq animate-fade-in-up"
    style={{ animationDelay: `${i * 0.1}s` }}
  >
                <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-5 hover:text-primary transition-colors duration-300 [&[data-state=open]]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </section>;
};
var stdin_default = FAQSection;
export {
  stdin_default as default
};
