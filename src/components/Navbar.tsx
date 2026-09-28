import { Link } from 'react-router-dom';
import { CalendarHeart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CalendarHeart className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-lg font-serif font-semibold tracking-tight text-stone-900">InviteLuxe</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/pricing" className="text-sm text-stone-600 hover:text-stone-900 transition-colors hidden sm:block">Pricing</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Dashboard</Link>
              <Link to="/templates" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors">Create</Link>
              <button onClick={() => signOut()} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">Sign in</Link>
              <Link to="/signup" className="text-sm bg-stone-900 text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors">Get started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
