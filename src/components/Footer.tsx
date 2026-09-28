import { Link } from 'react-router-dom';
import { CalendarHeart, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
                <CalendarHeart className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-lg font-serif font-semibold text-white">InviteLuxe</span>
            </div>
            <p className="text-sm text-stone-500 max-w-xs">Crafting unforgettable digital invitations for life's most precious moments.</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/templates" className="hover:text-amber-400 transition-colors">Templates</Link></li>
              <li><Link to="/pricing" className="hover:text-amber-400 transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center hover:bg-stone-700 transition-colors"><Github className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-6 text-sm text-stone-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} InviteLuxe. All rights reserved.</p>
          <p>Made with care for your celebrations.</p>
        </div>
      </div>
    </footer>
  );
}
