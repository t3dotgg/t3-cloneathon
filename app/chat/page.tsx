"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent, ChangeEvent, useRef, Fragment } from "react"; // Added Fragment
import { useChat, Message as VercelChatMessage } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Not used currently, can be added
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Chosen style

// Define a type for messages fetched from our DB, which includes a Prisma Role
interface ChatMessageFromDB {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT'; // Prisma Role enum
  createdAt: Date;
  userId: string;
}

// Component to render message content, handling code blocks
const ChatMessageContent = ({ content }: { content: string }) => {
  // Regex to find code blocks: ```[language]\ncode\n``` or ```\ncode\n```
  // It captures the optional language and the code content.
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [fullMatch, language, code] = match;
    // Add text part before the code block
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
    }
    // Add code block
    parts.push(
      <SyntaxHighlighter
        key={`code-${match.index}`}
        language={language || 'plaintext'} // Default to plaintext if no language specified
        style={okaidia}
        customStyle={{ borderRadius: '0.375rem', margin: '0.25rem 0' }} // Tailwind's rounded-md and my-1
        showLineNumbers // Optional: show line numbers
        wrapLines // Optional: wrap long lines
      >
        {String(code).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
    lastIndex = match.index + fullMatch.length;
  }

  // Add any remaining text part after the last code block
  if (lastIndex < content.length) {
    parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
  }

  // If no code blocks found, render plain text (or handle mixed content if parts array is populated)
  if (parts.length === 0) {
     return <>{content}</>; // Use Fragment for direct string children
  }

  return <>{parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)}</>;
};


export default function ChatPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [dbError, setDbError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleChatSubmit,
    setMessages,
    isLoading,
    error: chatError,
  } = useChat({
    api: "/api/chat/completions",
    onFinish: async (message: VercelChatMessage) => {
      try {
        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: message.content, role: "ASSISTANT" }),
        });
        if (!response.ok) {
          const errData = await response.json();
          setDbError(`Failed to save AI message: ${errData.message}`);
        }
      } catch (err) {
        setDbError(`Error saving AI message: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    onError: (error) => {
      console.error("Chat completion error:", error);
    }
  });

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const fetchHistory = async () => {
      try {
        setDbError(null);
        const response = await fetch("/api/chat/messages");
        if (!response.ok) {
          const errData = await response.json();
          setDbError(`Failed to load chat history: ${errData.message}`);
          return;
        }
        const historyFromDb: ChatMessageFromDB[] = await response.json();
        const vercelAiMessages: VercelChatMessage[] = historyFromDb.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.role.toLowerCase() as 'user' | 'assistant',
          createdAt: new Date(msg.createdAt),
        }));
        setMessages(vercelAiMessages);
      } catch (err) {
        setDbError(`Error loading history: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    if (session) fetchHistory();
  }, [session, sessionStatus, router, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmitWithSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageContent = input;
    const tempUserMessageId = `temp-user-${Date.now()}`;
    setMessages([...messages, { id: tempUserMessageId, role: 'user', content: userMessageContent, createdAt: new Date() }]);

    try {
      setDbError(null);
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessageContent, role: "USER" }),
      });
      if (!response.ok) {
        const errData = await response.json();
        setDbError(`Failed to save your message: ${errData.message}`);
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempUserMessageId));
        return;
      }
    } catch (err) {
      setDbError(`Error saving your message: ${err instanceof Error ? err.message : String(err)}`);
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempUserMessageId));
      return;
    }
    handleChatSubmit(e);
  };

  if (sessionStatus === "loading") return <div className="flex items-center justify-center min-h-screen"><p>Loading session...</p></div>;
  if (!session) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-card shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-foreground">Chat with AI</h1>
          <p className="text-sm text-muted-foreground">Welcome, {session.user?.name || session.user?.email}!</p>
        </div>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>Logout</Button>
      </header>

      <ScrollArea className="flex-grow p-4 space-y-4">
        {messages.map((m: VercelChatMessage) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}> {/* Increased max-w for code blocks */}
              <CardHeader className="pb-2 pt-3 px-4">
                <CardDescription className={m.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                  {m.role === 'user' ? 'You' : 'AI Assistant'}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm px-4 pb-3 prose dark:prose-invert max-w-none"> {/* Added prose for better text styling, max-w-none for SyntaxHighlighter */}
                <ChatMessageContent content={m.content} />
                {m.createdAt && (
                  <p className={`text-xs mt-1 ${m.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {(chatError || dbError) && (
        <div className="p-4">
          <Card className="bg-destructive text-destructive-foreground p-4">
            <CardTitle className="text-sm">Error</CardTitle>
            <CardContent className="text-xs p-0 pt-2">
              {chatError && <p>AI Error: {chatError.message}</p>}
              {dbError && <p>Database Error: {dbError}</p>}
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="bg-card border-t p-4">
        <form onSubmit={handleSubmitWithSave} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </footer>
    </div>
  );
}
