import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Sparkles,
    features: [
      'Access to free templates',
      'Unlimited invitations',
      'AI assistant (5 chats/month)',
      'Animated envelope reveal',
      'Shareable links',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: 'per month',
    icon: Crown,
    features: [
      'Everything in Free',
      'All premium templates',
      'Unlimited AI assistant chats',
      'Custom branding & colors',
      'Priority support',
      'Remove watermark',
    ],
    cta: 'Upgrade to Premium',
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-semibold text-stone-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">Start free forever. Upgrade when you need premium templates and unlimited AI.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? 'bg-stone-900 text-white shadow-2xl scale-105'
                  : 'bg-white border border-stone-200 shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-medium px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.highlight ? 'bg-amber-500/20' : 'bg-stone-100'
              }`}>
                <plan.icon className={`w-6 h-6 ${plan.highlight ? 'text-amber-400' : 'text-stone-700'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-stone-900'}`}>{plan.name}</h3>
              <div className="mb-6">
                <span className={`text-4xl font-serif font-bold ${plan.highlight ? 'text-white' : 'text-stone-900'}`}>{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? 'text-stone-400' : 'text-stone-500'}`}> / {plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-3 text-sm ${plan.highlight ? 'text-stone-300' : 'text-stone-700'}`}>
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-amber-400' : 'text-amber-600'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all group ${
                  plan.highlight
                    ? 'bg-amber-500 text-white hover:bg-amber-400'
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-stone-500 mt-12">
          Payment integration is set up as a placeholder. Connect your Stripe account to activate billing.
        </p>
      </div>
    </div>
  );
}
