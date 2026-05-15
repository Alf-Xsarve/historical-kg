import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserCircle, LogOut, ListChecks } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const checkAuth = () => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setUser(username);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  // Закрываем меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold hover:scale-105 transition">
          🇰🇬 <span>Кыргыз Тарыхы</span>
        </Link>

        {/* Основное меню */}
        <div className="flex items-center gap-8 text-lg">
          <Link to="/" className="hover:text-amber-300 transition">Главная</Link>
          <Link to="/figures" className="hover:text-amber-300 transition">Исторические лица</Link>
          <Link to="/suggestions" className="hover:text-amber-300 transition">Предложить лицо</Link>
        </div>

        {/* Профиль пользователя */}
        {user ? (
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 hover:text-amber-300 transition py-1 px-4 rounded-xl hover:bg-white/10"
            >
              <UserCircle size={28} />
              <span className="font-medium">{user}</span>
            </button>

            {/* Выпадающее меню */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white text-gray-800 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-5 py-4 border-b">
                  <p className="text-sm text-gray-500">Здравствуйте,</p>
                  <p className="font-semibold text-lg text-indigo-700">{user}</p>
                </div>

                <Link
                  to="/my-suggestions"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition"
                >
                  <ListChecks size={20} />
                  <span>Мои предложения</span>
                </Link>

                <div className="border-t my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition rounded-b-2xl"
                >
                  <LogOut size={20} />
                  <span>Выйти из аккаунта</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-amber-300 transition px-4 py-2">
              Войти
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-300 hover:text-black transition"
            >
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}