import { Button } from '@/components/ui/button';
import defaultTexts from '@/locales/pt-BR/NotFound.json';
import { useLocaleTexts } from '@/hooks/useLocaleTexts';

export default function NotFoundPage() {
  const texts = useLocaleTexts('notfound', defaultTexts);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 className="text-8xl font-bold text-blue-600" data-json-key="notfound.error.code">{texts.error.code}</h1>
          <h2 className="text-2xl font-semibold text-gray-800" data-json-key="notfound.error.title">{texts.error.title}</h2>
          <p className="text-muted-foreground" data-json-key="notfound.error.description">{texts.error.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild data-json-key="notfound.buttons.home">
            <a href="/" data-json-key="notfound.buttons.home">{texts.buttons.home}</a>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} data-json-key="notfound.buttons.back">
            {texts.buttons.back}
          </Button>
        </div>
      </div>
    </div>
  );
}
