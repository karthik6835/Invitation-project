import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { getTemplateById } from '@/data/templates';
import type { Invitation } from '@/types';
import { Crown, Sparkles, Calendar, Clock, MapPin, Mail, Heart, Share2, Check } from 'lucide-react';

type Phase = 'loading' | 'envelope' | 'opening' | 'revealed';

export default function InvitationViewPage() {
  const { uuid } = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    (async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('share_uuid', uuid)
        .maybeSingle();
      if (error || !data) {
        setError('This invitation could not be found or has been removed.');
        setPhase('loading');
        return;
      }
      setInvitation(data as Invitation);
      setPhase('envelope');
    })();
  }, [uuid]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
        <div className="text-center">
          <Heart className="w-12 h-12 text-stone-600 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-white mb-2">Invitation Not Found</h1>
          <p className="text-stone-400 mb-6">{error}</p>
          <Link to="/" className="text-amber-400 hover:underline">Go to InviteLuxe</Link>
        </div>
      </div>
    );
  }

  if (phase === 'loading' || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-stone-700 border-t-amber-400 rounded-full"
        />
      </div>
    );
  }

  const template = getTemplateById(invitation.template_id);
  const details = invitation.details;
  const theme = template?.theme;

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-white">
        Template not found.
      </div>
    );
  }

  // Envelope phase
  if (phase === 'envelope' || phase === 'opening') {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${theme.bgGradient} p-4 overflow-hidden`}>
        {/* Floating sparkles background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className={`w-3 h-3 ${theme.accentColor}`} />
            </motion.div>
          ))}
        </div>

        <div className="relative perspective-1000" style={{ width: 'min(340px, 85vw)' }}>
          {/* Envelope body */}
          <motion.div
            className="relative"
            animate={phase === 'opening' ? { y: -10 } : {}}
            transition={{ duration: 0.3 }}
          >
            {/* Envelope back */}
            <div className={`relative ${theme.cardBg} backdrop-blur-sm rounded-lg shadow-2xl border ${theme.accentColor.replace('text-', 'border-')} border-opacity-30`} style={{ aspectRatio: '5/3' }}>
              {/* Letter peeking out */}
              <motion.div
                className={`absolute inset-x-3 bottom-3 top-3 ${theme.cardBg} rounded-md shadow-lg flex flex-col items-center justify-center p-4 text-center overflow-hidden`}
                animate={phase === 'opening' ? { y: '-60%' } : { y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              >
                <p className={`text-xs ${theme.subTextColor} mb-1`} style={{ fontFamily: theme.fontFamily }}>
                  You're invited to
                </p>
                <p className={`text-lg font-semibold ${theme.textColor}`} style={{ fontFamily: theme.fontFamily }}>
                  {invitation.title}
                </p>
              </motion.div>

              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 overflow-hidden"
                style={{ transformOrigin: 'top', height: '50%' }}
                animate={phase === 'opening' ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <div
                  className={`w-full h-full ${theme.cardBg}`}
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    borderBottom: `1px solid ${theme.accentColor.replace('text-', 'rgba(')}`,
                  }}
                />
              </motion.div>

              {/* Front overlay (bottom triangle) */}
              <div className="absolute bottom-0 left-0 right-0" style={{ height: '50%', pointerEvents: 'none' }}>
                <div
                  className={`w-1/2 h-full absolute left-0 ${theme.cardBg}`}
                  style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
                />
                <div
                  className={`w-1/2 h-full absolute right-0 ${theme.cardBg}`}
                  style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
                />
              </div>

              {/* Wax seal */}
              {phase === 'envelope' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${theme.accentColor.replace('text-', 'bg-')} bg-opacity-80 shadow-lg`}>
                    <Heart className={`w-6 h-6 ${theme.textColor}`} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tap to open */}
            {phase === 'envelope' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center w-full"
              >
                <button
                  onClick={() => setPhase('opening')}
                  className={`${theme.textColor} text-sm font-medium animate-pulse`}
                  style={{ fontFamily: theme.fontFamily }}
                >
                  Tap to open your invitation
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Auto-transition after opening animation */}
          {phase === 'opening' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              onAnimationComplete={() => setTimeout(() => setPhase('revealed'), 200)}
            />
          )}
        </div>
      </div>
    );
  }

  // Revealed phase — full invitation
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} relative overflow-hidden`}>
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          >
            <Sparkles className={`w-2 h-2 ${theme.accentColor}`} />
          </motion.div>
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`w-full max-w-2xl ${theme.cardBg} backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 p-8 sm:p-12`}
        >
          {/* Decoration top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            {template.theme.decoration === 'gold' && <Crown className={`w-10 h-10 ${theme.accentColor} mx-auto`} />}
            {template.theme.decoration === 'rose' && <span className="text-4xl">🌹</span>}
            {template.theme.decoration === 'blossom' && <span className="text-4xl">🌸</span>}
            {template.theme.decoration === 'neon' && <span className="text-4xl">✨</span>}
            {template.theme.decoration === 'lullaby' && <span className="text-4xl">🍼</span>}
            {template.theme.decoration === 'emerald' && <span className="text-4xl">🌿</span>}
            {template.theme.decoration === 'sage' && <span className="text-4xl">🌿</span>}
            {template.theme.decoration === 'sapphire' && <span className="text-4xl">💎</span>}
            {template.theme.decoration === 'sunset' && <span className="text-4xl">🌅</span>}
            {template.theme.decoration === 'ivory' && <span className="text-4xl">📋</span>}
          </motion.div>

          {/* Ornamental divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`w-20 h-px ${theme.accentColor.replace('text-', 'bg-')} mx-auto mb-6 opacity-60`}
          />

          {/* Hosted by */}
          {details.hostName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`text-center text-sm ${theme.subTextColor} mb-3`}
              style={{ fontFamily: theme.fontFamily }}
            >
              Hosted by {details.hostName}
            </motion.p>
          )}

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`text-center text-3xl sm:text-5xl font-semibold ${theme.textColor} leading-tight mb-2`}
            style={{ fontFamily: theme.fontFamily }}
          >
            {details.guestOfHonor || invitation.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className={`text-center text-lg ${theme.accentColor} italic mb-6`}
            style={{ fontFamily: theme.fontFamily }}
          >
            {invitation.event_type} Celebration
          </motion.p>

          {/* Ornamental divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={`w-20 h-px ${theme.accentColor.replace('text-', 'bg-')} mx-auto mb-8 opacity-60`}
          />

          {/* Message */}
          {details.message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className={`text-center text-base ${theme.subTextColor} italic leading-relaxed mb-8 max-w-lg mx-auto`}
              style={{ fontFamily: theme.fontFamily }}
            >
              {details.message}
            </motion.p>
          )}

          {/* Event details grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-4 mb-8"
          >
            {details.eventDate && (
              <div className="flex items-center justify-center gap-3">
                <Calendar className={`w-4 h-4 ${theme.accentColor} flex-shrink-0`} />
                <span className={`text-sm ${theme.textColor}`}>
                  {details.eventDate}{details.eventTime && ` at ${details.eventTime}`}
                </span>
              </div>
            )}
            {!details.eventDate && details.eventTime && (
              <div className="flex items-center justify-center gap-3">
                <Clock className={`w-4 h-4 ${theme.accentColor} flex-shrink-0`} />
                <span className={`text-sm ${theme.textColor}`}>{details.eventTime}</span>
              </div>
            )}
            {details.venue && (
              <div className="flex items-center justify-center gap-3">
                <MapPin className={`w-4 h-4 ${theme.accentColor} flex-shrink-0`} />
                <span className={`text-sm ${theme.textColor}`}>{details.venue}</span>
              </div>
            )}
            {details.address && (
              <p className={`text-center text-xs ${theme.subTextColor} opacity-70`}>{details.address}</p>
            )}
          </motion.div>

          {/* Dress code */}
          {details.dressCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center mb-6"
            >
              <span className={`text-xs ${theme.subTextColor} uppercase tracking-wider`}>Dress Code</span>
              <p className={`text-sm ${theme.textColor} mt-1`}>{details.dressCode}</p>
            </motion.div>
          )}

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className={`w-20 h-px ${theme.accentColor.replace('text-', 'bg-')} mx-auto mb-6 opacity-40`}
          />

          {/* RSVP */}
          {(details.rsvpDate || details.rsvpContact) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="text-center mb-6"
            >
              {details.rsvpDate && (
                <p className={`text-sm ${theme.subTextColor}`}>
                  Please RSVP by {details.rsvpDate}
                </p>
              )}
              {details.rsvpContact && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Mail className={`w-3.5 h-3.5 ${theme.accentColor}`} />
                  <span className={`text-xs ${theme.subTextColor}`}>{details.rsvpContact}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Additional info */}
          {details.additionalInfo && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className={`text-center text-xs ${theme.subTextColor} opacity-60 italic max-w-md mx-auto mb-6`}
            >
              {details.additionalInfo}
            </motion.p>
          )}

          {/* Share button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center"
          >
            <button
              onClick={copyLink}
              className={`inline-flex items-center gap-2 ${theme.textColor} text-sm border ${theme.accentColor.replace('text-', 'border-')} border-opacity-30 rounded-full px-5 py-2.5 hover:bg-white/5 transition-colors`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link Copied!' : 'Share this invitation'}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer brand */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <Link to="/" className={`text-xs ${theme.subTextColor} opacity-50 hover:opacity-80 transition-opacity`}>
          Made with InviteLuxe
        </Link>
      </div>
    </div>
  );
}
