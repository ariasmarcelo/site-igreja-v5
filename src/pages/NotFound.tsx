import { Button } from '@/components/ui/button';
import { usePageContent } from '@/hooks/useContent';
import PageLoader from '@/components/PageLoader';

interface NotFoundTexts {
  error: { code: string; title: string; description: string };
  buttons: { home: string; back: string };
}

export default function NotFoundPage() {
  const { data: texts, loading, error } = usePageContent<NotFoundTexts>('notfound');
  
  if (loading) return <PageLoader />;
  if (!texts || !texts.error) return null;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-3">
          <h1 data-json-key="notfound.error.code">{texts.error.code}</h1>
          <h2 data-json-key="notfound.error.title">{texts.error.title}</h2>
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
