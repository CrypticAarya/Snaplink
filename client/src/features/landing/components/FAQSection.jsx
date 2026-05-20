import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
const faqs = [
  {
    question: "How does SnapLink work?",
    answer: "Simply paste your long URL into the input field and click 'Shorten Link'. SnapLink generates a unique, compact URL that redirects to your original link. It's fast, free, and requires no sign-up."
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
  return <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="mb-2 text-xl font-bold text-foreground sm:mb-3 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => <AccordionItem
    key={i}
    value={`item-${i}`}
    className="surface-card rounded-xl px-4 sm:px-5 border-none"
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
