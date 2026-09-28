import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Share2, Bot, ArrowRight, Check, Star } from 'lucide-react';

const features = [
  {
    icon: Palette,
    title: 'Premium Templates',
    description: 'Hand-crafted designs for weddings, birthdays, baby showers, and corporate galas.',
  },
  {
    icon: Sparkles,
    title: 'Animated Reveals',
    description: 'Each invitation opens with a cinematic envelope-unboxing animation that wows your guests.',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Chat with our AI to describe your event — it fills in all the details for you automatically.',
  },
  {
    icon: Share2,
    title: 'Shareable Links',
    description: 'Every invitation gets a unique link. Share via text, email, or social media in one tap.',
  },
];

const steps = [
  { num: '01', title: 'Choose a Template', desc: 'Browse free and premium designs categorized by event type.' },
  { num: '02', title: 'Customize with AI', desc: 'Let the AI assistant draft your details, or edit everything yourself.' },
  { num: '03', title: 'Share the Link', desc: 'Send your unique invitation link to guests — they see a stunning animated reveal.' },
];

const testimonials = [
  { name: 'Sarah & James', text: 'Our wedding guests were blown away. The animated envelope opening was magical.', role: 'Wedding, 200 guests' },
  { name: 'Priya M.', text: 'The AI assistant filled in all our event details from a simple chat. So effortless!', role: 'Birthday party' },
  { name: 'Marcus T.', text: 'Used it for our corporate gala. The Emerald Luxe template looked incredibly professional.', role: 'Corporate event' },
];

export default function LandingPage() {
  return (
    <div className="bg-stone-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Digital Invitations
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-stone-900 leading-[1.1] tracking-tight mb-6">
                Invitations that feel like
                <span className="block italic text-amber-700">opening a gift.</span>
              </h1>
              <p className="text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
                Create breathtaking digital invitations with animated reveals, AI-assisted customization, and premium templates for every occasion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/signup" className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all hover:scale-105 group">
                  Start Creating Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-stone-900 px-6 py-3 rounded-xl font-medium border border-stone-200 hover:border-stone-300 transition-all">
                  Browse Templates
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {['bg-rose-300', 'bg-amber-300', 'bg-sky-300', 'bg-emerald-300'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-stone-50`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-stone-500 mt-0.5">Loved by 12,000+ hosts</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/11650086/pexels-photo-11650086.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Elegant wedding invitation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 to-transparent" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 max-w-[200px]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-stone-900">AI Assistant</span>
                </div>
                <p className="text-xs text-stone-500">"Tell me about your event and I'll fill in the details!"</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-4 -right-4 bg-amber-500 text-white rounded-2xl shadow-xl p-4"
              >
                <Sparkles className="w-6 h-6 mb-1" />
                <p className="text-xs font-medium">Animated Reveal</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-stone-900 mb-4">Everything you need to invite beautifully</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">From template selection to AI-assisted content creation to shareable animated links.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-stone-700 group-hover:text-amber-700 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-stone-900 mb-4">Three steps to a stunning invitation</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-5xl font-serif font-bold text-amber-200 mb-4">{s.num}</div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{s.title}</h3>
                <p className="text-stone-600">{s.desc}</p>
                {i < steps.length - 1 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-stone-300 -translate-x-8" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase image */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-stone-900 mb-4">An experience your guests will remember</h2>
              <p className="text-stone-600 mb-6 leading-relaxed">When someone opens your invitation link, they're greeted with a beautiful envelope animation that opens to reveal your event details. It's personal, premium, and unforgettable.</p>
              <ul className="space-y-3 mb-8">
                {['Cinematic envelope-opening animation', 'Fully responsive on every device', 'Unique shareable link per invitation', 'No app download required for guests'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-amber-700" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-flex items-center gap-2 text-amber-700 font-medium hover:gap-3 transition-all">
                Create your first invitation <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.pexels.com/photos/33126589/pexels-photo-33126589.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                  alt="Luxury celebration setup"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-white mb-4">Loved by hosts everywhere</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-stone-900 border border-stone-800"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-stone-300 mb-4 leading-relaxed italic">"{t.text}"</p>
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-sm text-stone-500">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-amber-50 to-stone-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-serif font-semibold text-stone-900 mb-6">Ready to create something beautiful?</h2>
          <p className="text-lg text-stone-600 mb-8">Start with a free template today. Upgrade to premium whenever you're ready.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-stone-800 transition-all hover:scale-105 group">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
