import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import {
  CheckCircle,
  Trophy,
  Users,
  Calendar,
  Code,
  MessageSquare,
  ImageIcon,
  Search,
  GitBranch,
  Share,
  Zap,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 text-white/70 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Open Source Competition
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            T3 Chat
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              Cloneathon
            </span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Build an open source clone of T3 Chat in just one week. Compete for prizes and showcase your skills to the
            community.
          </p>

          {/* Subtle Countdown Timer */}
          <div className="mb-8">
            <CountdownTimer />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
              Join the Competition
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/5 px-8 py-3 text-lg"
            >
              View Rules
            </Button>
          </div>
        </div>

        {/* Competition Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="flex flex-col items-center text-center">
            <Calendar className="w-12 h-12 text-white/70 mb-4" />
            <h3 className="text-white text-2xl font-medium mb-2">1 Week</h3>
            <p className="text-white/50">Complete your clone within the competition timeframe</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Trophy className="w-12 h-12 text-white/70 mb-4" />
            <h3 className="text-white text-2xl font-medium mb-2">$6,000+</h3>
            <p className="text-white/50">Total prize pool for winners and participants</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-white/70 mb-4" />
            <h3 className="text-white text-2xl font-medium mb-2">Open Source</h3>
            <p className="text-white/50">All submissions must be open source and publicly available</p>
          </div>
        </div>

        {/* Prizes Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Prizes & Rewards</h2>

          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-white/70 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">1st Place</h3>
                <div className="text-3xl font-bold text-white">$5,000</div>
              </div>

              <div className="text-center">
                <Trophy className="w-8 h-8 text-white/70 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">2nd Place</h3>
                <div className="text-3xl font-bold text-white">$1,000</div>
              </div>

              <div className="text-center">
                <Users className="w-8 h-8 text-white/70 mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Top 8</h3>
                <div className="text-xl font-bold text-white">1 Year Free T3 Chat</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Requirements</h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6">Core Requirements</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-white/70 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-lg font-medium">Chat with Various LLMs</h4>
                      <p className="text-white/50">Implement support for multiple language models and providers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 ml-9">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Required</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <Users className="w-6 h-6 text-white/70 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-lg font-medium">Authentication & Sync</h4>
                      <p className="text-white/50">User authentication with chat history synchronization</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/70 ml-9">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Required</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Bonus Features</h3>

              <div className="grid md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  { icon: ImageIcon, title: "Upload Image Support", desc: "Allow users to upload and analyze images" },
                  { icon: Sparkles, title: "Generate Image Support", desc: "AI-powered image generation capabilities" },
                  { icon: Code, title: "Code Syntax Highlighting", desc: "Beautiful code formatting and highlighting" },
                  { icon: Zap, title: "Resumable Stream", desc: "Continue generation after page refresh" },
                  { icon: GitBranch, title: "Chat Branching", desc: "Create alternative conversation paths" },
                  { icon: Share, title: "Chat Sharing", desc: "Share conversations with others" },
                  { icon: Search, title: "Web Search", desc: "Integrate real-time web search" },
                  { icon: Sparkles, title: "Your Feature Ideas", desc: "Implement creative features of your own" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <feature.icon className="w-5 h-5 text-white/70 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">{feature.title}</h4>
                      <p className="text-white/50 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Judges Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Meet the Judges</h2>

          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Theo", role: "Creator of T3 Stack", twitter: "" },
                { name: "Mark", role: "Developer & Creator", twitter: "" },
                { name: "Julius", role: "Tech Expert", twitter: "" },
              ].map((judge, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{judge.name[0]}</span>
                  </div>
                  <h3 className="text-white font-medium">{judge.name}</h3>
                  <p className="text-white/50 text-sm mb-1">{judge.role}</p>
                  <Link href={judge.twitter || "#"} className="text-white/70 hover:text-white text-sm">
                    @{judge.name.toLowerCase()}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
          <p className="text-white/70 text-lg mb-8">
            Join the T3 Chat Cloneathon and showcase your development skills. Registration opens soon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Get Notified
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5">
              View GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
