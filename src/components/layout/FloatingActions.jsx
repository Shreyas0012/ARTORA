import { ArrowLeft, ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FloatingActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isHome) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 mix-blend-difference text-white">
      {/* Back Button (Only on subpages) */}
      {!isHome && (
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-transparent hover:bg-white/10 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
      )}
    </div>
  );
}
