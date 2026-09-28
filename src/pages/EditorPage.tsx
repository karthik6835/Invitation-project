import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getTemplateById } from '@/data/templates';
import type { InvitationDetails, Invitation } from '@/types';
import AIAssistant from '@/components/AIAssistant';
import { Save, Eye, ArrowLeft, Crown, Lock, Check, ExternalLink } from 'lucide-react';

const emptyDetails: InvitationDetails = {
  hostName: '',
  guestOfHonor: '',
  eventDate: '',
  eventTime: '',
  venue: '',
  address: '',
  message: '',
  rsvpDate: '',
  rsvpContact: '',
  dressCode: '',
  additionalInfo: '',
};

export default function EditorPage() {
  const { templateId, invitationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(() => templateId ? getTemplateById(templateId) : null);
  const [details, setDetails] = useState<InvitationDetails>(emptyDetails);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [invitationUuid, setInvitationUuid] = useState<string | null>(null);
  const [currentInvitationId, setCurrentInvitationId] = useState<string | null>(invitationId ?? null);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(!!invitationId);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing invitation
  useEffect(() => {
    if (!invitationId) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', invitationId)
        .maybeSingle();
      if (error || !data) {
        setError('Could not load this invitation.');
        setLoading(false);
        return;
      }
      const inv = data as Invitation;
      setDetails({ ...emptyDetails, ...inv.details });
      setTitle(inv.title);
      setEventType(inv.event_type);
      setInvitationUuid(inv.share_uuid);
      setCurrentInvitationId(inv.id);
      setIsPremiumUnlocked(inv.is_premium_unlocked);
      setTemplate(getTemplateById(inv.template_id));
      setLoading(false);
    })();
  }, [invitationId]);

  const handleDetailsUpdate = useCallback((newDetails: InvitationDetails) => {
    setDetails(newDetails);
  }, []);

  const handleSave = async () => {
    if (!user || !template) return;
    setSaving(true);
    setError(null);

    const payload = {
      user_id: user.id,
      template_id: template.id,
      event_type: eventType,
      title: title || 'Untitled Invitation',
      details: details as Record<string, string>,
      is_premium_unlocked: isPremiumUnlocked,
    };

    let result;
    if (currentInvitationId) {
      result = await supabase
        .from('invitations')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', currentInvitationId)
        .select('share_uuid')
        .maybeSingle();
    } else {
      result = await supabase
        .from('invitations')
        .insert(payload)
        .select('id, share_uuid')
        .maybeSingle();
    }

    setSaving(false);

    if (result.error) {
      setError('Failed to save. Please try again.');
      return;
    }

    if (result.data) {
      if (!currentInvitationId && result.data.id) {
        setCurrentInvitationId(result.data.id);
      }
      setInvitationUuid(result.data.share_uuid);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleUpgrade = () => {
    // Payment placeholder — in production this would redirect to Stripe Checkout
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    setIsPremiumUnlocked(true);
    setShowUpgradeModal(false);
    setSaved(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-600 mb-4">Template not found.</p>
        <button onClick={() => navigate('/templates')} className="text-amber-700 font-medium">Browse templates</button>
      </div>
    );
  }

  const isPremiumTemplate = template.isPremium;
  const canUseTemplate = !isPremiumTemplate || isPremiumUnlocked;

  const formFields: { key: keyof InvitationDetails; label: string; placeholder: string; type?: string }[] = [
    { key: 'guestOfHonor', label: 'Guest of Honor / Couple Names', placeholder: 'e.g., Sarah & James' },
    { key: 'hostName', label: 'Host Name(s)', placeholder: 'e.g., The Smith Family' },
    { key: 'eventDate', label: 'Event Date', placeholder: 'e.g., October 15, 2026', type: 'text' },
    { key: 'eventTime', label: 'Event Time', placeholder: 'e.g., 4:00 PM' },
    { key: 'venue', label: 'Venue Name', placeholder: 'e.g., The Grand Ballroom' },
    { key: 'address', label: 'Venue Address', placeholder: 'e.g., 123 Elegant Ave, New York, NY' },
    { key: 'dressCode', label: 'Dress Code', placeholder: 'e.g., Formal / Black Tie' },
    { key: 'rsvpDate', label: 'RSVP By', placeholder: 'e.g., October 1, 2026' },
    { key: 'rsvpContact', label: 'RSVP Contact', placeholder: 'e.g., rsvp@email.com or (555) 123-4567' },
    { key: 'message', label: 'Invitation Message', placeholder: 'A warm message to your guests...' },
    { key: 'additionalInfo', label: 'Additional Info', placeholder: 'Parking, gifts, special instructions...' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
            <ArrowLeft className="w-4 h-4 text-stone-600" />
          </button>
          <div>
            <h1 className="text-xl font-serif font-semibold text-stone-900">
              {currentInvitationId ? 'Edit Invitation' : 'Create Invitation'}
            </h1>
            <p className="text-xs text-stone-500">{template.name} • {eventType}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {invitationUuid && (
            <a
              href={`/invite/${invitationUuid}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white text-stone-700 border border-stone-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Preview
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !canUseTemplate}
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {saved ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>}

      {/* Premium lock notice */}
      {isPremiumTemplate && !isPremiumUnlocked && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Premium Template</p>
              <p className="text-xs text-amber-700">Unlock to save and share this invitation.</p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-400 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" /> Unlock for $9
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-4">Invitation Details</h2>

            <div className="mb-4">
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Title (for your dashboard)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sarah & James Wedding"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-900"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-900 bg-white"
              >
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Baby Shower</option>
                <option>Corporate</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {formFields.map((field) => (
                <div key={field.key} className={field.key === 'message' || field.key === 'additionalInfo' ? 'sm:col-span-2' : ''}>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{field.label}</label>
                  {field.key === 'message' || field.key === 'additionalInfo' ? (
                    <textarea
                      value={details[field.key] ?? ''}
                      onChange={(e) => setDetails({ ...details, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={field.key === 'message' ? 3 : 2}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-900 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type ?? 'text'}
                      value={details[field.key] ?? ''}
                      onChange={(e) => setDetails({ ...details, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm text-stone-900"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:sticky lg:top-20 self-start">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-900">Live Preview</h2>
              <span className="text-xs text-stone-400">Updates as you type</span>
            </div>
            <div className={`relative aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br ${template.theme.bgGradient}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center" style={{ fontFamily: template.theme.fontFamily }}>
                {/* Decoration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-3"
                >
                  {template.theme.decoration === 'gold' && <Crown className={`w-7 h-7 ${template.theme.accentColor}`} />}
                  {template.theme.decoration === 'rose' && <span className="text-2xl">🌹</span>}
                  {template.theme.decoration === 'blossom' && <span className="text-2xl">🌸</span>}
                  {template.theme.decoration === 'neon' && <span className="text-2xl">✨</span>}
                  {template.theme.decoration === 'lullaby' && <span className="text-2xl">🍼</span>}
                  {template.theme.decoration === 'emerald' && <span className="text-2xl">🌿</span>}
                  {template.theme.decoration === 'sage' && <span className="text-2xl">🌿</span>}
                  {template.theme.decoration === 'sapphire' && <span className="text-2xl">💎</span>}
                  {template.theme.decoration === 'sunset' && <span className="text-2xl">🌅</span>}
                  {template.theme.decoration === 'ivory' && <span className="text-2xl">📋</span>}
                </motion.div>

                <div className={`w-16 h-px ${template.theme.accentColor.replace('text-', 'bg-')} mb-3 opacity-60`} />

                <p className={`text-sm ${template.theme.subTextColor} mb-2`}>
                  {details.hostName ? `Hosted by ${details.hostName}` : 'You are cordially invited'}
                </p>

                <h3 className={`text-2xl font-semibold ${template.theme.textColor} leading-tight`}>
                  {details.guestOfHonor || 'Your Event Title'}
                </h3>

                <div className={`w-16 h-px ${template.theme.accentColor.replace('text-', 'bg-')} my-3 opacity-60`} />

                {details.message && (
                  <p className={`text-sm ${template.theme.subTextColor} italic max-w-xs leading-relaxed mb-4`}>
                    {details.message}
                  </p>
                )}

                {details.eventDate && (
                  <p className={`text-base font-medium ${template.theme.textColor}`}>
                    {details.eventDate}
                    {details.eventTime && ` • ${details.eventTime}`}
                  </p>
                )}

                {details.venue && (
                  <p className={`text-sm ${template.theme.subTextColor} mt-1`}>{details.venue}</p>
                )}

                {details.address && (
                  <p className={`text-xs ${template.theme.subTextColor} opacity-70 mt-0.5`}>{details.address}</p>
                )}

                {details.dressCode && (
                  <p className={`text-xs ${template.theme.subTextColor} mt-3`}>Dress Code: {details.dressCode}</p>
                )}

                {details.rsvpDate && (
                  <p className={`text-xs ${template.theme.subTextColor} mt-3 opacity-80`}>
                    RSVP by {details.rsvpDate}
                    {details.rsvpContact && ` • ${details.rsvpContact}`}
                  </p>
                )}

                {details.additionalInfo && (
                  <p className={`text-xs ${template.theme.subTextColor} mt-2 opacity-60`}>{details.additionalInfo}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant details={details} onDetailsUpdate={handleDetailsUpdate} eventType={eventType} />

      {/* Upgrade modal (payment placeholder) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Crown className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-stone-900">Unlock Premium Template</h2>
              <p className="text-stone-500 text-sm mt-1">Get access to "{template.name}" and all premium features.</p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-600">Premium Template</span>
                <span className="font-medium text-stone-900">$9.00</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-600">Unlimited AI Assistant</span>
                <span className="text-green-600 font-medium">Included</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200">
                <span className="font-semibold text-stone-900">Total</span>
                <span className="font-semibold text-stone-900">$9.00</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 text-center mb-4">
              Payment integration is configured as a placeholder. In production, this would open Stripe Checkout.
            </p>

            <button
              onClick={confirmUpgrade}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              Complete Purchase (Demo)
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full text-stone-500 text-sm mt-2 hover:text-stone-700 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
