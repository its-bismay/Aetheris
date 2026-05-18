import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { ChevronRight, Zap, BarChart2, Mic, FileDiff } from 'lucide-react';
import { useRef } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]" ref={containerRef}>

      <motion.div style={{ y }} className="absolute inset-0 z-0 flex items-start justify-center pointer-events-none" aria-hidden="true">
        <div className="h-[600px] w-[800px] -translate-y-1/2 rounded-full bg-[#6366F1]/10 opacity-50 blur-[120px]" />
      </motion.div>

      <main className="relative z-10 flex flex-col items-center px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        

        <section aria-labelledby="hero-heading" className="flex flex-col items-center text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 inline-flex items-center rounded-full border border-[#262626] bg-[#121212]/50 px-3 py-1 text-xs font-medium text-[#EDEDED] backdrop-blur-md"
          >
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#6366F1] animate-pulse" aria-hidden="true" />
            v4.6 Enterprise Launch
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6 font-serif text-5xl font-semibold tracking-tight text-[#EDEDED] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontFamily: 'Geist, sans-serif' }}
          >
            Intelligence at Scale
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="mb-10 max-w-2xl text-lg text-[#EDEDED]/70 sm:text-xl leading-relaxed"
          >
            The next-generation inference engine designed for ultra-low latency, massive token throughput, and real-time developer observability. Built for the modern enterprise.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="group relative inline-flex items-center justify-center rounded-sm bg-[#6366F1] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[#4F52E1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] overflow-hidden">
              <span className="relative z-10 flex items-center">
                Deploy Your Model <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <button className="inline-flex items-center justify-center rounded-sm border border-[#262626] bg-[#121212] px-8 py-3 text-sm font-medium text-[#EDEDED] transition-colors hover:bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]">
              View API Reference
            </button>
          </motion.div>
        </section>


        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl mb-32"
          aria-label="Platform Dashboard Preview"
        >
          <div className="relative w-full overflow-hidden rounded-xl border border-[#262626] bg-[#050505] shadow-2xl transition-transform hover:scale-[1.01] duration-500 group">

            <div className="absolute inset-0 bg-linear-to-br from-[#6366F1]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            

            <div className="flex items-center border-b border-[#262626] bg-[#121212] px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="h-3 w-3 rounded-full bg-[#262626]" />
                <div className="h-3 w-3 rounded-full bg-[#262626]" />
                <div className="h-3 w-3 rounded-full bg-[#262626]" />
              </div>
              <div className="mx-auto flex h-6 items-center rounded-sm bg-[#0A0A0A] px-3 border border-[#262626]">
                <span className="font-mono text-xs text-[#EDEDED]/50" aria-hidden="true">api.aetheris.ai/v1/inference</span>
              </div>
            </div>


            <div className="p-6 font-mono text-sm leading-relaxed text-[#EDEDED]/70 h-[400px] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-12 h-full border-r border-[#262626] bg-[#0A0A0A] flex flex-col items-center py-6 text-xs text-[#262626] select-none" aria-hidden="true">
                {[...Array(15)].map((_, i) => <span key={i} className="mb-[6px]">{i+1}</span>)}
              </div>
              <div className="pl-10">
                <div className="text-[#6366F1]">async function <span className="text-[#EDEDED]">streamInference</span>(prompt: string) {'{'}</div>
                <div className="pl-4 mt-2">
                  <span className="text-[#464554]">// Initialize connection with ultra-low latency node</span><br/>
                  <span className="text-[#8083ff]">const</span> client = <span className="text-[#8083ff]">new</span> AetherisClient({'{'} region: <span className="text-emerald-400/70">'global-edge'</span> {'}'});<br/><br/>
                  <span className="text-[#8083ff]">const</span> stream = <span className="text-[#8083ff]">await</span> client.models.generate.stream({'{'}<br/>
                  <div className="pl-4">
                    model: <span className="text-emerald-400/70">'aetheris-pro-v4'</span>,<br/>
                    messages: [{'{'} role: <span className="text-emerald-400/70">'user'</span>, content: prompt {'}'}],<br/>
                    temperature: <span className="text-amber-400/70">0.7</span>,<br/>
                    max_tokens: <span className="text-amber-400/70">4096</span>
                  </div>
                  {'}'});<br/><br/>
                  <span className="text-[#8083ff]">for await</span> (<span className="text-[#8083ff]">const</span> chunk <span className="text-[#8083ff]">of</span> stream) {'{'}<br/>
                  <div className="pl-4">
                    process.stdout.write(chunk.choices[<span className="text-amber-400/70">0</span>].delta.content);
                  </div>
                  {'}'}
                </div>
                <div className="mt-2">{'}'}</div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#050505] to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.section>


        <section aria-labelledby="features-heading" className="w-full max-w-6xl mb-32">
          <h2 id="features-heading" className="sr-only">Platform Features</h2>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <motion.div variants={fadeInUp} className="group flex flex-col rounded-xl border border-[#262626] bg-[#121212] p-8 transition-colors hover:border-[#464554] hover:bg-[#1A1C1C]">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-sm bg-[#0A0A0A] border border-[#262626] text-[#6366F1]" aria-hidden="true">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#EDEDED]">Streaming Inference</h3>
              <p className="mb-8 text-sm text-[#EDEDED]/60 leading-relaxed">Experience zero-wait response times with our proprietary streaming architecture. Optimized for real-time applications requiring immediate visual feedback.</p>
              
              <div className="mt-auto rounded-md border border-[#262626] bg-[#0A0A0A] p-4 font-mono text-xs" aria-hidden="true">
                <div className="text-[#EDEDED]/50 mb-2">POST /v1/chat/completions</div>
                <div className="text-[#EDEDED]">
                  <span className="text-[#6366F1]">"stream"</span>: <span className="text-amber-400/70">true</span>,<br/>
                  <span className="text-[#6366F1]">"model"</span>: <span className="text-emerald-400/70">"aetheris-pro-v4"</span>
                </div>
              </div>
            </motion.div>


            <motion.div variants={fadeInUp} className="group flex flex-col rounded-xl border border-[#262626] bg-[#121212] p-8 transition-colors hover:border-[#464554] hover:bg-[#1A1C1C]">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-sm bg-[#0A0A0A] border border-[#262626] text-[#6366F1]" aria-hidden="true">
                <BarChart2 className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#EDEDED]">Token Metrics</h3>
              <p className="mb-8 text-sm text-[#EDEDED]/60 leading-relaxed">Granular observability into token usage, cost optimization, and latency performance spikes across global regions.</p>
              
              <div className="mt-auto flex h-24 items-end gap-2 px-2" aria-hidden="true">
                {[40, 70, 45, 90, 60, 30].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "w-full rounded-t-sm bg-[#262626] transition-colors group-hover:bg-[#464554]",
                      i === 3 && "bg-[#6366F1] group-hover:bg-[#8083ff]"
                    )}
                  />
                ))}
              </div>
            </motion.div>


            <motion.div variants={fadeInUp} className="group flex flex-col rounded-xl border border-[#262626] bg-[#121212] p-8 transition-colors hover:border-[#464554] hover:bg-[#1A1C1C]">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-sm bg-[#0A0A0A] border border-[#262626] text-[#6366F1]" aria-hidden="true">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#EDEDED]">Multimodal Input</h3>
              <p className="mb-8 text-sm text-[#EDEDED]/60 leading-relaxed">Seamlessly switch between audio transients and text tokens. Support for ultra-high fidelity audio processing with native ASR.</p>
              
              <div className="mt-auto flex h-16 items-center rounded-full border border-[#262626] bg-[#0A0A0A] px-4" aria-hidden="true">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#262626] text-[#EDEDED]">
                  <div className="h-0 w-0 border-y-4 border-y-transparent border-l-[6px] border-l-white ml-1" />
                </div>
                <div className="ml-4 flex h-full w-full items-center gap-[2px]">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: "20%" }}
                      animate={{ height: ["20%", `${Math.random() * 80 + 20}%`, "20%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                      className={cn(
                        "w-1 rounded-full",
                        i < 12 ? "bg-[#6366F1]" : "bg-[#262626]"
                      )}
                    />
                  ))}
                </div>
              </div>
            </motion.div>


            <motion.div variants={fadeInUp} className="group flex flex-col rounded-xl border border-[#262626] bg-[#121212] p-8 transition-colors hover:border-[#464554] hover:bg-[#1A1C1C]">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-sm bg-[#0A0A0A] border border-[#262626] text-[#6366F1]" aria-hidden="true">
                <FileDiff className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#EDEDED]">Token-Level Diffing</h3>
              <p className="mb-8 text-sm text-[#EDEDED]/60 leading-relaxed">Visualize the precise evolution of model weights and prompt completions with sub-token granularity.</p>
              
              <div className="mt-auto rounded-md border border-[#262626] bg-[#0A0A0A] p-4 font-mono text-xs flex flex-col gap-2" aria-hidden="true">
                <div className="flex items-center gap-2 text-red-400/80 bg-red-400/10 px-2 py-1 rounded-sm w-max">
                  <span>-</span>
                  <span>the quick brown fox</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-sm w-max">
                  <span>+</span>
                  <span>the accelerated onyx fox</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>


        <section aria-labelledby="metrics-heading" className="w-full max-w-5xl mb-32 border-y border-[#262626] py-16">
          <h2 id="metrics-heading" className="sr-only">Platform Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#262626]">
            {[
              { value: "99.99%", label: "UPTIME SLA" },
              { value: "<2ms", label: "MEDIAN LATENCY" },
              { value: "10T+", label: "TOKENS SERVED" },
              { value: "150+", label: "GLOBAL NODES" }
            ].map((metric, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center justify-center pt-8 md:pt-0"
              >
                <div className="text-4xl md:text-5xl font-serif font-semibold text-[#EDEDED] mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>{metric.value}</div>
                <div className="text-xs font-mono font-medium tracking-widest text-[#EDEDED]/50">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <section aria-labelledby="cta-heading" className="w-full max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-2xl border border-[#262626] bg-linear-to-b from-[#121212] to-[#0A0A0A] p-12 md:p-20 text-center"
          >

            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 w-[60%] bg-[#6366F1]/10 blur-[80px] rounded-full pointer-events-none" aria-hidden="true" />
            
            <h2 id="cta-heading" className="relative z-10 font-serif text-3xl md:text-5xl font-semibold text-[#EDEDED] mb-6" style={{ fontFamily: 'Geist, sans-serif' }}>
              Scale Your Intelligence Today
            </h2>
            <p className="relative z-10 text-[#EDEDED]/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Join over 2,000+ engineering teams building the future of autonomous systems on Aetheris.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="inline-flex items-center justify-center rounded-sm bg-[#EDEDED] px-8 py-3 text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]">
                Create Free Account
              </button>
              <button className="inline-flex items-center justify-center rounded-sm border border-[#262626] bg-transparent px-8 py-3 text-sm font-medium text-[#EDEDED] transition-colors hover:bg-[#262626]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}


function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
