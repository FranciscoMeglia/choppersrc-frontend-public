export function QuoteBlock({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <blockquote className="border-l-4 border-primary pl-6">
      <p className="text-2xl font-semibold sm:text-3xl">“{quote}”</p>
      <footer className="mt-4 text-sm text-ink/60">— {author}</footer>
    </blockquote>
  );
}
