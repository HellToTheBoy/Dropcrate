"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is DropCrate really free?",
    answer:
      "Yes! DropCrate is completely free to use. You unlock skins by completing verification steps, which help us cover our costs through partner offers.",
  },
  {
    question: "How do I receive my skin?",
    answer:
      "After completing verification, you'll receive a trade offer from our Steam bot. Simply accept the trade to receive your skin. Make sure your Steam inventory is set to public.",
  },
  {
    question: "What verification steps do I need to complete?",
    answer:
      "You'll need to complete two quick verification tasks. These are simple offers from our partners that help us fund the giveaways. Each takes less than a minute.",
  },
  {
    question: "Can I unlock multiple skins?",
    answer:
      "You can unlock one skin per day. Come back daily for new chances to win different skins from our constantly updated collection.",
  },
  {
    question: "What happens if I don't receive my skin?",
    answer:
      "If you don't receive your trade offer within 24 hours, please contact our support team. We'll investigate and ensure you get your skin.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about DropCrate
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
