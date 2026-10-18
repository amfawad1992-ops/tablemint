import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title, description, step }) {
  return (
    <div className="flex items-center justify-center min-h-full p-8">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
          <Construction className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-brand-darkText mb-2">{title}</h2>
        <p className="text-sm text-brand-mutedText mb-4">{description}</p>
        <p className="text-xs text-brand-mutedText bg-brand-content border border-brand-border rounded-lg px-3 py-2 inline-block">
          Coming in {step}
        </p>
      </div>
    </div>
  );
}