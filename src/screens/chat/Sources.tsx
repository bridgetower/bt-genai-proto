import { FileText, Globe } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SourceReference } from "@/types";

import ProjectDetails from "./ProjectDetails";

interface SourceLinkProps {
  sourceArray: SourceReference[];
  activeIndex: number;
}

const WebsiteSource: React.FC<{ content: string }> = ({ content }) => (
  <div className="w-full flex gap-1 items-center bg-background mb-1 px-2 py-1 rounded-md cursor-default group hover:bg-accent/50 transition-colors">
    <Globe className="text-foreground group-hover:text-primary transition-colors" size={14} />
    <div className="underline text-sm truncate">
      <a href={content} target="_blank" rel="noreferrer noopener" className="hover:text-primary transition-colors">
        {content}
      </a>
    </div>
  </div>
);

const DocumentSource: React.FC<{ content: string }> = ({ content }) => {
  const documentData = useMemo(() => {
    try {
      const parsed = JSON.parse(content);
      return {
        file_name: parsed.file_name || "Unknown Document",
        project_id: parsed.project_id,
        content: parsed
      };
    } catch {
      return {
        file_name: "Unknown Document",
        content
      };
    }
  }, [content]);

  return <ProjectDetails id={documentData.project_id || ""} />;
};

export const Sources: React.FC<SourceLinkProps> = ({ sourceArray, activeIndex }) => {
  const [openItems, setOpenItems] = useState<string>("");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update open items and scroll to active item when activeIndex changes
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < sourceArray.length) {
      setOpenItems(`source${activeIndex}`);

      // Scroll to active item after a small delay to ensure accordion is open
      setTimeout(() => {
        if (activeItemRef.current && containerRef.current) {
          const container = containerRef.current;
          const item = activeItemRef.current;

          const containerRect = container.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();

          if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
            item.scrollIntoView({
              behavior: "smooth",
              block: "nearest"
            });
          }
        }
      }, 100);
    }
  }, [activeIndex, sourceArray.length]);

  // Handle empty state
  if (sourceArray.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Sources</h1>
        <div className="text-center text-muted-foreground py-8 bg-accent/50 rounded-lg">No sources available for this conversation.</div>
      </div>
    );
  }

  return (
    <div className="p-4" ref={containerRef}>
      <h1 className="text-xl font-bold mb-4 text-primary">Sources</h1>

      <Accordion type="single" collapsible value={openItems} onValueChange={setOpenItems} className="space-y-2">
        {sourceArray.map((source: SourceReference, index: number) => (
          <AccordionItem
            ref={index === activeIndex ? activeItemRef : undefined}
            value={`source${index}`}
            key={index}
            className={`border rounded-lg transition-all duration-300 ${
              index === activeIndex ? "border-gray-300 shadow-md bg-accent/10" : "border-border hover:border-gray-300"
            }`}
          >
            <AccordionTrigger
              className={`
                text-[#1890FF] hover:no-underline px-4 transition-all duration-300
                ${index === activeIndex ? "font-medium" : ""}
                hover:bg-accent/50 rounded-t-lg
              `}
            >
              <span className="flex items-center gap-2">
                {source.refType === "website" ? (
                  <Globe
                    size={16}
                    className={`
                      transition-colors duration-300
                      ${index === activeIndex ? "text-primary" : "text-muted-foreground"}
                    `}
                  />
                ) : (
                  <FileText
                    size={16}
                    className={`
                      transition-colors duration-300
                      ${index === activeIndex ? "text-primary" : "text-muted-foreground"}
                    `}
                  />
                )}
                <span className="flex items-baseline gap-2 ">
                  <span>Source {index + 1}</span>
                  {/* {index === activeIndex && <span className="text-xs text-muted-foreground">(Active)</span>} */}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              {source.refType === "website" ? <WebsiteSource content={source.content} /> : <DocumentSource content={source.content} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
