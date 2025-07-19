import React from 'react';
import { Image, Sparkles, Bot, FileText, Brain, Wand2 } from 'lucide-react';
import { ImageGeneratorPage } from './ImageGeneratorPage';
import { DocumentAnalyzer } from './DocumentAnalyzer';
import { cn } from '../lib/utils';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  component?: React.ComponentType<any>;
}

const tools: Tool[] = [
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Create unique images with advanced AI models',
    icon: <Image className="h-6 w-6 text-purple-400" />,
    component: ImageGeneratorPage
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Get help with coding and development',
    icon: <Bot className="h-6 w-6 text-blue-400" />,
    comingSoon: true
  },
  {
    id: 'document-analyzer',
    name: 'Document Analyzer',
    description: 'Extract insights from documents and files',
    icon: <FileText className="h-6 w-6 text-green-400" />,
    component: DocumentAnalyzer
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Analyze and summarize research papers',
    icon: <Brain className="h-6 w-6 text-pink-400" />,
    comingSoon: true
  }
];

interface ToolsPageProps {
  onShowComingSoon: (feature: string, description: string) => void;
}

export function ToolsPage({ onShowComingSoon }: ToolsPageProps) {
  const [activeTool, setActiveTool] = React.useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (activeTool) {
      setIsTransitioning(true);
      setShouldRender(activeTool);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }
  }, [activeTool]);

  React.useEffect(() => {
    if (!activeTool && shouldRender) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShouldRender(null);
        setIsTransitioning(false);
      }, 200);
    }
  }, [activeTool]);

  const ActiveToolComponent = activeTool 
    ? tools.find(t => t.id === activeTool)?.component 
    : null;

  if (shouldRender && tools.find(t => t.id === shouldRender)?.component) {
    const Component = tools.find(t => t.id === shouldRender)?.component!;
    return (
      <div 
        className={cn(
          "transition-opacity duration-200",
          isTransitioning ? "opacity-0" : "opacity-100"
        )}
      >
        <Component setActiveTool={setActiveTool} />
      </div>
    );
  }

  return (
    <div className={cn(
      "max-w-4xl mx-auto transition-opacity duration-200",
      isTransitioning ? "opacity-0" : "opacity-100"
    )}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
          AI Tools
        </h2>
        <p className="text-gray-400 text-lg">
          Powerful tools powered by artificial intelligence
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              if (tool.comingSoon) {
                onShowComingSoon(tool.name, `${tool.name} is coming soon! This powerful tool will help you ${tool.description.toLowerCase()}`);
              } else {
                setActiveTool(tool.id);
              }
            }}
            className={cn(
              "bg-[#141414]/50 backdrop-blur-sm rounded-xl p-6 border text-left transition-all duration-200 group",
              tool.comingSoon 
                ? "border-[#232323] hover:border-purple-500/30 opacity-75" 
                : activeTool === tool.id
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-[#232323] hover:border-purple-500/30"
            )}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110",
                tool.comingSoon ? "bg-[#1A1A1A]" : "bg-gradient-to-br from-purple-500 to-pink-500"
              )}>
                {tool.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{tool.name}</h3>
                  {tool.comingSoon && (
                    <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs text-purple-400 font-medium">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{tool.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Tool */}
      {ActiveToolComponent && (
        <ActiveToolComponent
          isOpen={true}
          onClose={() => setActiveTool(null)}
        />
      )}
    </div>
  );
}