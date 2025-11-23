

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CHANGE THIS → Get free key from: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = "09ad8ace66eec34302943272db0e8d2c";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [movies, setMovies] = useState({});
  const [heroMovie, setHeroMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlist, setWatchlist] = useState(
    JSON.parse(localStorage.getItem("watchlist") || "[]")
  );

  // 2-second splash screen
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch movies
  useEffect(() => {
    if (!TMDB_API_KEY || TMDB_API_KEY.includes("YOUR_")) {
      toast.error("Add your TMDB API key!");
      return;
    }

    const fetchMovies = async () => {
      const categories = {
        trending: `/trending/movie/week?api_key=${TMDB_API_KEY}`,
        originals: `/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
        topRated: `/movie/top_rated?api_key=${TMDB_API_KEY}`,
        action: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
        comedy: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
        horror: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
        romance: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
        documentaries: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`,
      };

      const data = {};
      for (const [key, endpoint] of Object.entries(categories)) {
        try {
          const res = await fetch(`${TMDB_BASE_URL}${endpoint}`);
          const json = await res.json();
          data[key] = json.results || [];
        } catch (e) {
          data[key] = [];
        }
      }

      setMovies(data);
      setHeroMovie(data.trending[0]);
    };

    fetchMovies();
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.warn("Please fill all fields");

    if (isLogin) {
      const saved = localStorage.getItem("user");
      if (saved) {
        const { email: savedEmail, password: savedPass } = JSON.parse(saved);
        if (savedEmail === email && savedPass === password) {
          setUser({ email });
          toast.success("Welcome back!");
          return;
        }
      }
      toast.error("Wrong email or password");
    } else {
      localStorage.setItem("user", JSON.stringify({ email, password }));
      setUser({ email });
      toast.success("Account created & logged in!");
    }
    setEmail("");
    setPassword("");
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out");
  };

  const toggleWatchlist = (movie) => {
    let newList;
    if (watchlist.some((m) => m.id === movie.id)) {
      newList = watchlist.filter((m) => m.id !== movie.id);
      toast.info("Removed from My List");
    } else {
      newList = [...watchlist, movie];
      toast.success("Added to My List");
    }
    setWatchlist(newList);
    localStorage.setItem("watchlist", JSON.stringify(newList));
  };

  // Splash Screen
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-red-600 text-7xl font-black tracking-wider"
        >
          NEXFLIX
        </motion.div>
      </div>
    );
  }

  // Login / Register Screen
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/95 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-red-900/30"
          >
            <h2 className="text-5xl font-bold text-center text-red-600 mb-10">
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            <form onSubmit={handleAuth} className="space-y-6">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600 outline-none transition"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
 onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-600 outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-lg transition"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400">
              {isLogin ? "New to Nexflix?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-500 font-bold hover:underline"
              >
                {isLogin ? "Sign up now" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
        <ToastContainer theme="dark" position="top-right" />
      </>
    );
  }

  // Main App (after login)
  return (
    <>
      <div className="bg-black text-white min-h-screen">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent px-6 py-4">
          <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-black text-red-600">NEXFLIX</h1>
            <div className="flex items-center gap-6">
              <span className="hidden sm:block">{user.email}</span>
              <button
                onClick={logout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        {heroMovie && (
          <div className="relative h-screen">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={`${IMG_BASE_URL}/original${heroMovie.backdrop_path}`}
                alt={heroMovie.title || heroMovie.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-32 left-8 max-w-3xl">
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl"
              >
                {heroMovie.title || heroMovie.name}
              </motion.h1>
              <p className="text-lg md:text-2xl mb-8 max-w-2xl line-clamp-3 drop-shadow-lg">
                {heroMovie.overview}
              </p>
              <div className="flex gap-4">
                <button className="px-10 py-4 bg-white text-black font-bold text-xl rounded flex items-center gap-3 hover:bg-gray-200 transition">
                  Play
                </button>
                <button
                  onClick={() => toggleWatchlist(heroMovie)}
                  className="px-10 py-4 bg-gray-600/80 backdrop-blur hover:bg-gray-500/80 rounded text-xl font-semibold transition"
                >
                  {watchlist.some((m) => m.id === heroMovie.id) ? "Added" : "+ My List"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Movie Rows */}
        <div className="relative z-10 -mt-48 pb-20 px-4 md:px-10">
          {Object.entries(movies).map(([category, list]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 capitalize">
                {category === "originals" ? "Nexflix Originals" : category.replace(/([A-Z])/g, " $1")}
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {list.map((movie) => (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    key={movie.id}
                    className="min-w-[220px] md:min-w-[300px] cursor-pointer transition"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <img
                      src={`${IMG_BASE_URL}/w500${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="rounded-lg shadow-2xl w-full"
                    />
                    <p className="mt-3 text-center font-medium text-sm md:text-base">
                      {movie.title || movie.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Movie Detail Modal */}
        <AnimatePresence>
          {selectedMovie && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMovie(null)}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[95vh] overflow-y-auto"
              >
                <img
                  src={`${IMG_BASE_URL}/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                  alt=""
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="p-8 md:p-12">
                  <h1 className="text-3xl md:text-5xl font-bold mb-6">
                    {selectedMovie.title || selectedMovie.name}
                  </h1>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    {selectedMovie.overview || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-10 py-4 bg-red-600 hover:bg-red-700 rounded text-xl font-bold transition">
                      Play
                    </button>
                    <button
                      onClick={() => toggleWatchlist(selectedMovie)}
                      className="px-10 py-4 border-2 border-gray-400 hover:border-white rounded text-xl font-semibold transition"
                    >
                      {watchlist.some((m) => m.id === selectedMovie.id)
                        ? "In My List"
                        : "+ Add to My List"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ToastContainer theme="dark" position="bottom-right" />
      </div>
    </>
  );
}