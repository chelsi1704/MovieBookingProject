import { useQuery, useMutation, useQueryClient }
  from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/common/Spinner';
import notificationApi from '../../api/notificationApi';

const NotificationsPage = () => {
  const qc = useQueryClient();

  const { data: notifs, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      notificationApi.getAll().then(r => r.data.data),
  });

  const markRead = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries(['notifications',
                                           'unreadCount']),
  });

  const typeColors = {
    BOOKING: 'bg-green-500/20 text-green-400',
    PAYMENT: 'bg-blue-500/20 text-blue-400',
    OFFER: 'bg-yellow-500/20 text-yellow-400',
    REMINDER: 'bg-purple-500/20 text-purple-400',
    SYSTEM: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white
                         font-display">
            Notifications
          </h1>
          <button
            onClick={() => markRead.mutate()}
            className="flex items-center gap-1.5 text-sm
                       text-white/50 hover:text-white
                       transition-colors"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        </div>

        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : !notifs?.length ? (
          <div className="glass-card p-12 text-center">
            <Bell size={40}
                  className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No notifications yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifs.map(n => (
              <div
                key={n.id}
                className={`glass-card p-4 transition-all
                  ${!n.isRead ? 'border-primary/20' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full
                                    bg-primary mt-1.5
                                    flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2
                                    mb-1">
                      <p className="text-white text-sm
                                    font-semibold">
                        {n.title}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5
                        rounded-full ${typeColors[n.type]
                          || typeColors.SYSTEM}`}>
                        {n.type}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs
                                  leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-white/20 text-[10px] mt-2">
                      {n.timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;