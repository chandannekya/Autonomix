"use client";

import React from "react";
import { signIn } from "next-auth/react";
import {
  Terminal,
  Cpu,
  Zap,
  Bot,
  Globe2,
  Database,
  ArrowRight,
  Workflow,
  FileText,
  Mail,
  ShieldCheck,
  Cloud,
} from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-cyan/30 flex flex-col font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-border-soft bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent-cyan/30 bg-accent-cyan/10">
              <Zap size={16} className="text-accent-cyan" />
            </div>
            <span className="text-lg font-bold tracking-widest uppercase text-text-primary group-hover:text-accent-cyan transition-colors font-display">
              AutonomiX
            </span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full border border-border-strong text-text-muted uppercase tracking-widest hidden sm:inline-block">
              Platform Beta
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm font-mono text-text-muted hover:text-text-primary hidden md:block transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-mono text-text-muted hover:text-text-primary hidden md:block transition-colors">Architecture</a>
            <button
              onClick={handleLogin}
              className="px-5 py-2 text-xs font-mono tracking-widest uppercase bg-text-primary text-bg-primary hover:bg-white transition-all rounded-md font-bold"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent-cyan/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-mono text-[10px] md:text-xs uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              The Agentic Framework is Here
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 font-display leading-[1.1]">
              Stop Chatting. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-blue-400 to-purple-400">
                Execute Workflows.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-xl">
              Move beyond basic conversational AI. AutonomiX is a developer-first platform to build, configure, and monitor autonomous digital employees with permanent memory and real-world tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogin}
                className="px-8 py-4 bg-accent-cyan text-bg-primary font-mono tracking-widest uppercase text-sm font-bold rounded-lg hover:bg-accent-cyan/90 transition-all flex items-center justify-center gap-2 group"
              >
                Start Building 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                className="px-8 py-4 border border-border-strong text-text-primary font-mono tracking-widest uppercase text-sm rounded-lg hover:bg-bg-tertiary transition-all flex items-center justify-center gap-2"
              >
                <Terminal size={16} className="text-text-muted" />
                View Documentation
              </button>
            </div>
          </div>

          {/* Right: Code/Terminal Mockup (Vercel Style) */}
          <div className="relative transform md:-rotate-y-6 md:perspective-1000">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-cyan/20 to-purple-500/20 blur-3xl opacity-50 rounded-full" />
            <div className="relative rounded-xl border border-border-strong bg-[#0c0c0c] shadow-2xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-soft bg-bg-secondary/50">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 font-mono text-[10px] text-text-disabled uppercase">Agent Execution Stream</span>
              </div>
              {/* Terminal Body */}
              <div className="p-5 font-mono text-[11px] md:text-xs leading-5 space-y-3">
                <div className="flex gap-3 text-text-muted">
                  <span className="text-accent-cyan shrink-0">→</span>
                  <span>System: Initializing Agent Config... [OK]</span>
                </div>
                <div className="flex gap-3 text-text-muted">
                  <span className="text-accent-cyan shrink-0">→</span>
                  <span>Goal: Research "AutonomiX Platform" and email report.</span>
                </div>
                <div className="flex gap-3 text-purple-400">
                  <span className="shrink-0 animate-pulse">⟳</span>
                  <span>Agent is thinking... analyzing plan of action.</span>
                </div>
                <div className="flex gap-3 text-yellow-400">
                  <span className="shrink-0">⚙</span>
                  <span>Tool Selected: <span className="text-white bg-bg-tertiary px-1 rounded">web_search</span></span>
                </div>
                <div className="flex gap-3 pl-6 text-text-disabled">
                  <span>Input: "AutonomiX Platform features"</span>
                </div>
                <div className="flex gap-3 text-green-400">
                  <span className="shrink-0">✓</span>
                  <span>Tool Result: Retrieved 4 highly relevant sources.</span>
                </div>
                <div className="flex gap-3 text-yellow-400">
                  <span className="shrink-0">⚙</span>
                  <span>Tool Selected: <span className="text-white bg-bg-tertiary px-1 rounded">pdf_generator</span></span>
                </div>
                <div className="flex gap-3 pl-6 text-text-disabled">
                  <span>Status: Generating PDF Buffer...</span>
                </div>
                <div className="flex gap-3 text-accent-cyan border-t border-border-soft pt-3 mt-3">
                  <span className="shrink-0">★</span>
                  <span>Task Complete: Report successfully generated and emailed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Integrations Banner */}
      <section className="py-10 border-y border-border-soft bg-bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center font-mono text-[10px] text-text-disabled uppercase tracking-[0.2em] mb-6">
            Powered By & Integrated With
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 font-display font-bold text-lg"><Cpu /> Gemini 2.5</div>
            <div className="flex items-center gap-2 font-display font-bold text-lg"><Database /> Chroma DB</div>
            <div className="flex items-center gap-2 font-display font-bold text-lg"><Cloud /> Cloudinary</div>
            <div className="flex items-center gap-2 font-display font-bold text-lg"><Globe2 /> Tavily Search</div>
            <div className="flex items-center gap-2 font-display font-bold text-lg"><Workflow /> LangChain</div>
          </div>
        </div>
      </section>

      {/* Feature Grid (The Why) */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Not just another chatbot.
            </h2>
            <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
              AutonomiX provides the infrastructure to build, isolated, goal-oriented AI agents. Give them tools, give them memory, and let them work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-accent-cyan/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-accent-cyan/10 group-hover:border-accent-cyan/30 transition-all">
                <Database size={24} className="text-text-primary group-hover:text-accent-cyan transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Vector Memory</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Powered by ChromaDB. Agents map and store conversation history permanently. They don't just remember your last prompt; they remember your business context from last month.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-blue-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-400/10 group-hover:border-blue-400/30 transition-all">
                <Workflow size={24} className="text-text-primary group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Dynamic Tools</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Connect your custom API keys. Agents can actively browse the live web, read current news, calculate complex math, or query your internal corporate database.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-purple-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-400/10 group-hover:border-purple-400/30 transition-all">
                <Terminal size={24} className="text-text-primary group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Execution Streaming</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Never guess what the AI is doing. Our Server-Sent Events (SSE) pipeline streams the exact reasoning, tool selection, and errors directly to your frontend in real-time.
              </p>
            </div>
            
             <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-green-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-400/10 group-hover:border-green-400/30 transition-all">
                <FileText size={24} className="text-text-primary group-hover:text-green-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Document Generation</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Agents can compile their research, format it, and seamlessly generate fully automated PDF reports using our integrated PDFKit microservices.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-orange-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-400/10 group-hover:border-orange-400/30 transition-all">
                <Mail size={24} className="text-text-primary group-hover:text-orange-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Action Oriented</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Stop copying and pasting text. Tell your agent to "Email my team a summary of the marketing meeting," and watch it send real emails via Nodemailer.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-bg-secondary border border-border-soft hover:border-pink-400/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-soft flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-400/10 group-hover:border-pink-400/30 transition-all">
                <ShieldCheck size={24} className="text-text-primary group-hover:text-pink-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-display">Strict Guardrails</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Every agent is a rigid database entity. You restrict exactly which tools they can use, ensuring an SEO agent can't accidentally email your clients.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works / Meta Architecture */}
      <section id="how-it-works" className="py-32 relative border-t border-border-soft overflow-hidden bg-[#050505]">
        {/* Deep background glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24 cursor-default">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              Meta-Generation Architecture
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Agents building Agents.
            </h2>
            <p className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed">
              You don't write code to deploy workers. You describe the problem, and our Gemini-powered Architect dynamically provisions a new micro-service, connects tools, and assigns vector memory.
            </p>
          </div>

          {/* Architecture Pipeline Visual */}
          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-0" />
            
            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="group relative mt-10 lg:mt-0">
                <div className="absolute -inset-1 bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-full p-8 rounded-2xl bg-[#0c0c0c] border border-border-strong hover:border-white/20 transition-all flex flex-col">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-bg-secondary border font-display text-xl font-bold border-border-soft flex items-center justify-center text-text-primary z-10 shadow-lg group-hover:-translate-y-1 transition-transform">
                    1
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mt-6 mb-4 text-center">Human Intent</h3>
                  <div className="flex-1 bg-black/60 border border-white/5 rounded-lg p-5 font-mono text-sm text-text-secondary shadow-inner">
                    <span className="text-accent-cyan block mb-2">User Prompt:</span>
                    "I need a dedicated researcher to monitor our competitors and generate PDF summaries every single week."
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative mt-14 lg:mt-0">
                <div className="absolute -inset-1 bg-gradient-to-b from-purple-500/30 to-transparent rounded-2xl blur-md opacity-20 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-full p-8 rounded-2xl bg-[#0c0c0c] border border-purple-500/30 hover:border-purple-500/60 transition-all flex flex-col shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-bg-primary border border-purple-500/50 flex items-center justify-center text-purple-400 z-10 shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:-translate-y-1 transition-transform group-hover:rotate-12">
                    <Cpu size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mt-6 mb-4 text-center">AI Architect</h3>
                  <div className="flex-1 bg-black/60 border border-purple-500/20 rounded-lg p-5 font-mono text-xs text-text-muted space-y-4 shadow-inner">
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"/> Synthesizing Role...</div>
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.2s'}}/> Attaching <span className="text-white bg-white/10 px-1 py-0.5 rounded">Tavily Search</span></div>
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.4s'}}/> Attaching <span className="text-white bg-white/10 px-1 py-0.5 rounded">PDFGenerator</span></div>
                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.6s'}}/> Indexing Vector Memory...</div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative mt-14 lg:mt-0">
                <div className="absolute -inset-1 bg-gradient-to-b from-accent-cyan/30 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-full p-8 rounded-2xl bg-[#0c0c0c] border border-border-strong hover:border-accent-cyan/40 transition-all flex flex-col">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-bg-primary border border-accent-cyan/40 flex items-center justify-center text-accent-cyan z-10 shadow-[0_0_30px_rgba(0,255,255,0.3)] group-hover:-translate-y-1 transition-transform group-hover:scale-110">
                    <Database size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mt-6 mb-4 text-center">Deployed Entity</h3>
                  <div className="flex-1 bg-black/60 border border-white/5 rounded-lg p-4 overflow-x-auto shadow-inner flex items-center scrollbar-thin scrollbar-thumb-border-soft">
                    <pre className="font-mono text-[11px] text-text-secondary leading-loose w-full whitespace-pre-wrap word-break">
                      <code>
<span className="text-purple-400">const</span> agent = {'{'}
  <span className="text-blue-400">id:</span> <span className="text-green-400">"ag_92x8"</span>,
  <span className="text-blue-400">role:</span> <span className="text-green-400">"Analyst"</span>,
  <span className="text-blue-400">tools:</span> [
    <span className="text-white bg-white/10 px-1 rounded leading-none inline-block mb-1 mt-1">"web"</span>,
    <span className="text-white bg-white/10 px-1 rounded leading-none inline-block">"pdf"</span>
  ],
  <span className="text-blue-400">status:</span> <span className="text-accent-cyan">"active"</span>
{'}'};
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative text-center px-6">
         <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-accent-cyan/10 pointer-events-none" />
         <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to automate your workflows?
            </h2>
            <p className="text-lg text-text-muted mb-10">
              Join the beta platform. Build your first autonomous agent in under 2 minutes. No credit card required.
            </p>
            <button
              onClick={handleLogin}
              className="px-10 py-5 bg-white text-bg-primary font-mono tracking-widest uppercase text-sm font-bold rounded-lg hover:bg-gray-200 transition-all inline-flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
            >
              <Bot size={18} className="text-bg-primary" />
              Build Your First Agent
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-8 bg-bg-secondary border-t border-border-soft px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-accent-cyan/30 bg-accent-cyan/10">
              <Zap size={12} className="text-accent-cyan" />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-text-muted group-hover:text-accent-cyan transition-colors font-display">
              AutonomiX
            </span>
          </div>
          
          <div className="flex gap-6 font-mono text-xs text-text-disabled uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-center border-t border-border-soft/50 pt-8">
          <p className="text-[10px] font-mono text-text-disabled uppercase tracking-widest">
            © {new Date().getFullYear()} AutonomiX OS. Built for the Autonomous Era.
          </p>
        </div>
      </footer>
    </div>
  );
}
