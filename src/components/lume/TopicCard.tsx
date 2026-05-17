import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';
import { Link } from "@tanstack/react-router";

interface Topic {
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  color_accent: string;
}

export function TopicCard({ topic }: { topic: Topic }) {
  // @ts-ignore - Dynamic icon loading
  const IconComponent = (Icons[topic.icon_name as keyof typeof Icons] || Icons.HelpCircle) as React.FC<LucideProps>;

  return (
    <Link
      to="/conversation/$topic"
      params={{ topic: topic.slug }}
      className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-soft transition-all duration-400 hover:-translate-y-1 hover:shadow-lift border border-border/50"
    >
      <div 
        className="absolute inset-0 opacity-[0.03] grayscale transition-all duration-700 group-hover:opacity-10 group-hover:scale-110 group-hover:grayscale-0"
        style={{ 
          backgroundImage: `url('https://source.unsplash.com/featured/?${topic.slug}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div 
        className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150"
        style={{ backgroundColor: topic.color_accent }}
      />
      
      <div 
        className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ backgroundColor: `${topic.color_accent}15`, color: topic.color_accent }}
      >
        <IconComponent size={24} strokeWidth={2} />
      </div>

      <div className="relative z-10">
        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
          {topic.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {topic.description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        <span>Start practicing</span>
        <Icons.ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
