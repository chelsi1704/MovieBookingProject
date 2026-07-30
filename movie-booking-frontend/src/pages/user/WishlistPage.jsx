import { useQuery, useMutation, useQueryClient }
  from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Spinner from '../../components/common/Spinner';
import wishlistApi from '../../api/wishlistApi';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () =>
      wishlistApi.getAll().then(r => r.data.data),
  });

  const remove = useMutation({
    mutationFn: (movieId) => wishlistApi.remove(movieId),
    onSuccess: () => {
      qc.invalidateQueries(['wishlist']);
      toast.success('Removed from wishlist');
    }
  });

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white
                       font-display mb-6">
          My Wishlist
        </h1>
        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : !wishlist?.length ? (
          <div className="glass-card p-12 text-center">
            <Heart size={40}
                   className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40">
              Your wishlist is empty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3
                          md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="relative group">
                <div
                  className="movie-card cursor-pointer"
                  onClick={() =>
                    navigate(`/movies/${item.movie.id}`)}
                >
                  <img
                    src={item.movie.posterUrl ||
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'}
                    alt={item.movie.title}
                    className="w-full aspect-[2/3] object-cover
                               rounded-xl"
                  />
                </div>
                <button
                  onClick={() => remove.mutate(item.movie.id)}
                  className="absolute top-2 right-2 p-1.5
                             rounded-full bg-red-500/80
                             text-white opacity-0
                             group-hover:opacity-100
                             transition-all"
                >
                  <Heart size={12} className="fill-white" />
                </button>
                <p className="text-white text-xs mt-2
                              text-center line-clamp-2 px-1">
                  {item.movie.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;