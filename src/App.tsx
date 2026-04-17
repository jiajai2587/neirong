import { useState, useEffect, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/Sidebar';
import { ContentEditor } from '@/components/ContentEditor';
import { AiDetection } from '@/components/AiDetection';
import { HomogeneityCheck } from '@/components/HomogeneityCheck';
import { TrafficPredictionView } from '@/components/TrafficPrediction';
import { LogicCheck } from '@/components/LogicCheck';
import { SensitiveCheck } from '@/components/SensitiveCheck';
import { MarketingCheck } from '@/components/MarketingCheck';
import { ComprehensiveReportView } from '@/components/ComprehensiveReport';
import { PolishView } from '@/components/PolishView';
import { GenerateArticleView } from '@/components/GenerateArticleView';
import { HotArticlesView } from '@/components/HotArticlesView';
import { ApiSettingsView } from '@/components/ApiSettingsView';
import { ManualView } from '@/components/ManualView';
import { ContactView } from '@/components/ContactView';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  // Load saved content
  useEffect(() => {
    const savedContent = localStorage.getItem('editor_content');
    const savedTitle = localStorage.getItem('editor_title');
    if (savedContent) setContent(savedContent);
    if (savedTitle) setTitle(savedTitle);
  }, []);

  // Auto-save content
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('editor_content', content);
      localStorage.setItem('editor_title', title);
    }, 500);
    return () => clearTimeout(timer);
  }, [content, title]);

  const handleContentGenerated = useCallback((generatedContent: string) => {
    setContent(generatedContent);
    const firstLine = generatedContent.split('\n')[0].replace(/^#+\s*/, '').trim();
    if (firstLine.length < 50) {
      setTitle(firstLine);
    }
    setActiveTab('editor');
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <ContentEditor
            content={content}
            onContentChange={setContent}
            title={title}
            onTitleChange={setTitle}
          />
        );
      case 'ai-detect':
        return <AiDetection content={content} />;
      case 'homogeneity':
        return <HomogeneityCheck content={content} />;
      case 'traffic':
        return <TrafficPredictionView content={content} title={title} />;
      case 'logic':
        return <LogicCheck content={content} />;
      case 'sensitive':
        return <SensitiveCheck content={content} />;
      case 'marketing':
        return <MarketingCheck content={content} />;
      case 'report':
        return <ComprehensiveReportView content={content} title={title} />;
      case 'polish':
        return <PolishView content={content} onContentChange={setContent} />;
      case 'generate':
        return <GenerateArticleView onContentGenerated={handleContentGenerated} />;
      case 'hot-articles':
        return <HotArticlesView />;
      case 'api-settings':
        return <ApiSettingsView />;
      case 'manual':
        return <ManualView />;
      case 'contact':
        return <ContactView />;
      default:
        return (
          <ContentEditor
            content={content}
            onContentChange={setContent}
            title={title}
            onTitleChange={setTitle}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'ml-16' : 'ml-56'
        )}
      >
        <div className="max-w-5xl mx-auto p-6">
          {renderContent()}
        </div>
      </main>

      <Toaster />
      <Analytics />
    </div>
  );
}

export default App;
