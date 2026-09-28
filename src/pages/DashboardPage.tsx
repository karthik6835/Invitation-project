import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getTemplateById } from '@/data/templates';
import type { Invitation } from '@/types';
import { Plus, Calendar, ExternalLink, Copy, Check, Trash2, Crown, Pencil } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvitations() {
      if (!user) return;
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setInvitations(data as Invitation[]);
      setLoading(false);
    }
    fetchInvitations();
  }, [user]);

  const copyLink = (uuid: string, id: string) => {
    const url = `${window.location.origin}/invite/${uuid}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this invitation? This cannot be undone.')) return;
    setDeletingId(id);
    const { error } = await supabase.from('invitations').delete().eq('id', id);
    if (!error) setInvitations((prev) => prev.filter((inv) => inv.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-stone-900">My Invitations</h1>
          <p className="text-stone-500 mt-1">Manage and share your digital invitations</p>
        </div>
        <Link
          to="/templates"
          className="inline-flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-stone-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Invitation
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
        </div>
      ) : invitations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-stone-400" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-2">No invitations yet</h2>
          <p className="text-stone-500 mb-6">Create your first beautiful digital invitation.</p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Choose a Template
          </Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv, i) => {
            const template = getTemplateById(inv.template_id);
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Preview */}
                <Link to={`/editor/edit/${inv.id}`} className="block relative aspect-[4/3] overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${template?.theme.bgGradient ?? 'from-stone-700 to-stone-900'}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    {template?.theme.decoration === 'gold' && <Crown className="w-6 h-6 text-amber-400 mb-2" />}
                    {template?.theme.decoration === 'rose' && <span className="text-2xl mb-1">🌹</span>}
                    {template?.theme.decoration === 'blossom' && <span className="text-2xl mb-1">🌸</span>}
                    {template?.theme.decoration === 'neon' && <span className="text-2xl mb-1">✨</span>}
                    {template?.theme.decoration === 'lullaby' && <span className="text-2xl mb-1">🍼</span>}
                    {template?.theme.decoration === 'emerald' && <span className="text-2xl mb-1">🌿</span>}
                    {template?.theme.decoration === 'sage' && <span className="text-2xl mb-1">🌿</span>}
                    {template?.theme.decoration === 'sapphire' && <span className="text-2xl mb-1">💎</span>}
                    {template?.theme.decoration === 'sunset' && <span className="text-2xl mb-1">🌅</span>}
                    {template?.theme.decoration === 'ivory' && <span className="text-2xl mb-1">📋</span>}
                    <h3
                      className={`text-lg font-semibold ${template?.theme.textColor ?? 'text-white'}`}
                      style={{ fontFamily: template?.theme.fontFamily }}
                    >
                      {inv.title}
                    </h3>
                    <p className={`text-xs ${template?.theme.subTextColor ?? 'text-stone-300'} mt-1`}>
                      {inv.event_type}
                    </p>
                  </div>
                  {inv.is_premium_unlocked && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Premium
                    </div>
                  )}
                </Link>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm">{inv.title}</h3>
                      <p className="text-xs text-stone-500">
                        {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-md">{template?.name ?? inv.template_id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLink(inv.share_uuid, inv.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm bg-stone-100 text-stone-700 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                      {copiedId === inv.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === inv.id ? 'Copied!' : 'Copy link'}
                    </button>
                    <Link
                      to={`/invite/${inv.share_uuid}`}
                      target="_blank"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/editor/edit/${inv.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      disabled={deletingId === inv.id}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
