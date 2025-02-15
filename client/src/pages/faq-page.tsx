import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Cash on Delivery for eligible orders."
  },
  {
    question: "How long does shipping take?",
    answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on the destination."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. Contact our customer service team to initiate a return."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a confirmation email with a tracking number that you can use to monitor your delivery status."
  }
];

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions about our products and services.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 p-6 bg-muted rounded-lg text-center">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          We're here to help! Contact our support team anytime.
        </p>
        <a
          href="mailto:support@example.com"
          className="text-primary hover:underline"
        >
          support@example.com
        </a>
      </div>
    </div>
  );
}
