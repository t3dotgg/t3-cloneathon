"use client";
import React from "react";
import { useFormedible } from "@/hooks/use-formedible";
import { z } from "zod";
import { Sparkles } from "lucide-react";

// Custom page component for tools page with 2-column layout
const ToolsPageComponent: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
  page: number;
  totalPages: number;
}> = ({ children, title, description }) => {
  const childrenArray = React.Children.toArray(children).filter(Boolean);
  
  // Split into tool checkboxes (first 11) and other fields (remaining)
  const toolCheckboxes = childrenArray.slice(0, 11);
  const otherFields = childrenArray.slice(11);
  
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="space-y-2">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
          {description && <p className="text-white/70">{description}</p>}
        </div>
      )}
      
      {/* Tools section with 2-column grid */}
      <div>
        <h4 className="text-white font-medium mb-4">What tools did you use? (Check all that apply)</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {toolCheckboxes}
        </div>
      </div>
      
      {/* Other fields */}
      <div className="space-y-4">
        {otherFields}
      </div>
    </div>
  );
};



const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  project_repo: z.string().url("Must be a valid URL"),
  project_deploy: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  
  // Selling points - optional!
  selling_point_1: z.string().optional(),
  selling_point_2: z.string().optional(),
  selling_point_3: z.string().optional(),
  
  // Things not happy with - optional!
  unhappy_1: z.string().optional(),
  unhappy_2: z.string().optional(),
  unhappy_3: z.string().optional(),
  
  // Tools used - checkboxes
  tool_t3chat: z.boolean().optional(),
  tool_cursor: z.boolean().optional(),
  tool_vscode: z.boolean().optional(),
  tool_windsurf: z.boolean().optional(),
  tool_aider: z.boolean().optional(),
  tool_codex: z.boolean().optional(),
  tool_trae: z.boolean().optional(),
  tool_github_copilot: z.boolean().optional(),
  tool_claude: z.boolean().optional(),
  tool_chatgpt: z.boolean().optional(),
  tool_other: z.boolean().optional(),
  tools_other_text: z.string().optional(),
  
  // Code percentage
  code_percentage: z.number().min(0).max(100),
  
  // Challenges - optional!
  challenges: z.string().optional(),
  
  // Tips and resources - optional!
  tips: z.string().optional(),
  
  // Other projects - optional!
  other_projects: z.string().optional(),
});

export function RegisterSurvey() {
  const { Form } = useFormedible({
    schema,
    fields: [
      // Basic Information (Page 1)
      { 
        name: "name", 
        type: "text", 
        label: "What's your name?", 
        placeholder: "John Doe",
        page: 1 
      },
      { 
        name: "email", 
        type: "email", 
        label: "Email address", 
        placeholder: "john@example.com",
        page: 1 
      },
      { 
        name: "project_repo", 
        type: "url", 
        label: "What is your submission repository?", 
        placeholder: "https://github.com/username/project",
        page: 1 
      },
      { 
        name: "project_deploy", 
        type: "url", 
        label: "Deployment URL (optional)", 
        placeholder: "https://yourproject.vercel.app",
        description: "Share a live demo if available",
        page: 1 
      },

      // Project Highlights (Page 2)
      { 
        name: "selling_point_1", 
        type: "text", 
        label: "🚀 First key selling point", 
        placeholder: "What makes your project special?",
        page: 2 
      },
      { 
        name: "selling_point_2", 
        type: "text", 
        label: "⭐ Second key selling point", 
        placeholder: "Another great feature or aspect",
        conditional: (values) => values.selling_point_1 && values.selling_point_1.length > 0,
        page: 2 
      },
      { 
        name: "selling_point_3", 
        type: "text", 
        label: "💎 Third key selling point", 
        placeholder: "One more thing that stands out",
        conditional: (values) => values.selling_point_2 && values.selling_point_2.length > 0,
        page: 2 
      },

      // Areas for Improvement (Page 3)
      { 
        name: "unhappy_1", 
        type: "text", 
        label: "😤 First thing you're not happy with", 
        placeholder: "What could be better?",
        page: 3 
      },
      { 
        name: "unhappy_2", 
        type: "text", 
        label: "🔧 Second thing you're not happy with", 
        placeholder: "Another area for improvement",
        conditional: (values) => values.unhappy_1 && values.unhappy_1.length > 0,
        page: 3 
      },
      { 
        name: "unhappy_3", 
        type: "text", 
        label: "⚠️ Third thing you're not happy with", 
        placeholder: "One more thing you'd change",
        conditional: (values) => values.unhappy_2 && values.unhappy_2.length > 0,
        page: 3 
      },

      // Tools and Development (Page 4) - Checkbox grid
      { 
        name: "tool_t3chat", 
        type: "checkbox", 
        label: "t3.chat", 
        page: 4 
      },
      { 
        name: "tool_cursor", 
        type: "checkbox", 
        label: "Cursor", 
        page: 4 
      },
      { 
        name: "tool_vscode", 
        type: "checkbox", 
        label: "VSCode", 
        page: 4 
      },
      { 
        name: "tool_windsurf", 
        type: "checkbox", 
        label: "Windsurf", 
        page: 4 
      },
      { 
        name: "tool_aider", 
        type: "checkbox", 
        label: "Aider", 
        page: 4 
      },
      { 
        name: "tool_codex", 
        type: "checkbox", 
        label: "Codex", 
        page: 4 
      },
      { 
        name: "tool_trae", 
        type: "checkbox", 
        label: "Trae", 
        page: 4 
      },
      { 
        name: "tool_github_copilot", 
        type: "checkbox", 
        label: "GitHub Copilot", 
        page: 4 
      },
      { 
        name: "tool_claude", 
        type: "checkbox", 
        label: "Claude", 
        page: 4 
      },
      { 
        name: "tool_chatgpt", 
        type: "checkbox", 
        label: "ChatGPT", 
        page: 4 
      },
      { 
        name: "tool_other", 
        type: "checkbox", 
        label: "Other tools", 
        page: 4 
      },
      { 
        name: "tools_other_text", 
        type: "textarea", 
        label: "Which other tools?", 
        placeholder: "List any other tools you used...",
        conditional: (values) => values.tool_other === true,
        page: 4 
      },
      { 
        name: "code_percentage", 
        type: "slider", 
        label: "How much of the code did you actually write?", 
        min: 0,
        max: 100,
        step: 5,
        description: "0% = All AI generated, 100% = All manually written",
        page: 4 
      },

      // Challenges and Insights (Page 5)
      { 
        name: "challenges", 
        type: "textarea", 
        label: "What was the most challenging thing you encountered?", 
        placeholder: "Describe the biggest obstacle or difficulty you faced...",
        page: 5 
      },
      { 
        name: "tips", 
        type: "textarea", 
        label: "Any tips or resources for working with LLMs?", 
        placeholder: "Share insights that helped you (keep it concise)...",
        description: "Help the community learn from your experience!",
        conditional: (values) => values.challenges && values.challenges.length > 0,
        page: 5 
      },
      { 
        name: "other_projects", 
        type: "textarea", 
        label: "Any other projects worth checking out?", 
        placeholder: "Share links or descriptions of your other work...",
        conditional: (values) => values.tips && values.tips.length > 0,
        page: 5 
      },
    ],
    pages: [
      { page: 1, title: "Project Information", description: "Tell us about your submission" },
      { page: 2, title: "Project Highlights", description: "What are you most proud of? (Share what you want!)" },
      { page: 3, title: "Room for Growth", description: "What would you improve? (Totally optional!)" },
      { page: 4, title: "Tools & Development", description: "What tools helped you build this?", component: ToolsPageComponent },
      { page: 5, title: "Share Your Experience", description: "Help others learn from your journey" },
    ],
    progress: { showSteps: true, showPercentage: true },
    nextLabel: "Continue →",
    previousLabel: "← Back", 
    submitLabel: "Submit Survey 🎉",
        formClassName: "space-y-6",
    formOptions: {
        defaultValues: {
          name: "",
          email: "",
          project_repo: "",
          project_deploy: "",
          selling_point_1: "",
          selling_point_2: "",
          selling_point_3: "",
          unhappy_1: "",
          unhappy_2: "",
          unhappy_3: "",
          tool_t3chat: false,
          tool_cursor: false,
          tool_vscode: false,
          tool_windsurf: false,
          tool_aider: false,
          tool_codex: false,
          tool_trae: false,
          tool_github_copilot: false,
          tool_claude: false,
          tool_chatgpt: false,
          tool_other: false,
          tools_other_text: "",
          code_percentage: 50,
          challenges: "",
          tips: "",
          other_projects: "",
        },
      onSubmit: async ({ value }) => {
        console.log("Survey submitted:", value);
        // Here you would typically send the data to your backend
        alert("Does this count as a Rick Roll ? Alert like it 1999, yeah !");
      },
    },
    onPageChange: (page, direction) => {
      console.log(`Navigated to page ${page} via ${direction}`);
    },
  });

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 text-white/70 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Project Submission
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            T3 Chat
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Cloneathon
            </span>
          </h1>

          <h2 className="text-3xl font-bold text-white mb-4">
            Project Survey
          </h2>
          
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tell us about your amazing project and development experience!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <Form />
          </div>
          
          <div className="text-center mt-8 text-white/40 text-sm">
            <p>Your responses help us understand the community and improve future events.</p>
          </div>
        </div>
      </div>
    </div>
  );
}