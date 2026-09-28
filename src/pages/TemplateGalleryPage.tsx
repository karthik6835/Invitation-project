import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { templates, templateCategories, getTemplatesByCategory } from '@/data/templates';
import { Crown, Check, ArrowRight } from 'lucide-react';

export default function TemplateGalleryPage() {
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();
  const filtered = getTemplatesByCategory(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-stone-900 mb-3">Choose a Template</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">Browse our collection of free and premium designs. Pick one to start customizing.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {templateCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => navigate(`/editor/${tpl.id}`)}
          >
            {/* Preview */}
            <div className={`relative aspect-[4/5] bg-gradient-to-br ${tpl.theme.bgGradient} overflow-hidden`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                {/* Decoration */}
                <div className="mb-4">
                  {tpl.theme.decoration === 'gold' && <Crown className={`w-8 h-8 ${tpl.theme.accentColor} mx-auto`} />}
                  {tpl.theme.decoration === 'rose' && <span className="text-3xl">🌹</span>}
                  {tpl.theme.decoration === 'blossom' && <span className="text-3xl">🌸</span>}
                  {tpl.theme.decoration === 'neon' && <span className="text-3xl">✨</span>}
                  {tpl.theme.decoration === 'lullaby' && <span className="text-3xl">🍼</span>}
                  {tpl.theme.decoration === 'emerald' && <span className="text-3xl">🌿</span>}
                  {tpl.theme.decoration === 'sage' && <span className="text-3xl">🌿</span>}
                  {tpl.theme.decoration === 'sapphire' && <span className="text-3xl">💎</span>}
                  {tpl.theme.decoration === 'sunset' && <span className="text-3xl">🌅</span>}
                  {tpl.theme.decoration === 'ivory' && <span className="text-3xl">📋</span>}
                </div>

                {/* Ornamental line */}
                <div className={`w-12 h-px ${tpl.theme.accentColor.replace('text-', 'bg-')} mb-3 opacity-50`} />

                <h3
                  className={`text-xl font-semibold ${tpl.theme.textColor}`}
                  style={{ fontFamily: tpl.theme.fontFamily }}
                >
                  {tpl.preview.title}
                </h3>
                <p className={`text-sm ${tpl.theme.subTextColor} mt-2 italic`} style={{ fontFamily: tpl.theme.fontFamily }}>
                  {tpl.preview.subtitle}
                </p>

                <div className={`w-12 h-px ${tpl.theme.accentColor.replace('text-', 'bg-')} mt-3 opacity-50`} />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-center pb-6">
                <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span className="inline-flex items-center gap-2 bg-white text-stone-900 px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
                    Use this template <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Premium badge */}
              {tpl.isPremium && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3" /> Premium
                </div>
              )}
              {!tpl.isPremium && (
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur text-stone-700 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-600" /> Free
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-stone-900">{tpl.name}</h3>
                <span className="text-xs text-stone-400">{tpl.category}</span>
              </div>
              <p className="text-sm text-stone-500 mt-1 line-clamp-1">{tpl.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
