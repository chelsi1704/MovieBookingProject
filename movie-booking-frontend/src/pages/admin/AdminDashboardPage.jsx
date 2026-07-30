import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Users,
  Film,
  DollarSign,
  Ticket,
  BarChart3,
  Building2,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import Spinner from "../../components/common/Spinner";
import axiosInstance from "../../api/axiosInstance";

const AdminDashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () =>
      axiosInstance
        .get("/api/admin/dashboard")
        .then((r) => r.data.data),
  });

  const cards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats?.totalUsers || 0,
      color: "text-blue-400",
    },
    {
      icon: Film,
      label: "Movies",
      value: stats?.totalMovies || 0,
      color: "text-purple-400",
    },
    {
      icon: Ticket,
      label: "Bookings",
      value: stats?.totalBookings || 0,
      color: "text-green-400",
    },
    {
      icon: DollarSign,
      label: "Revenue",
      value: `₹${Math.round(
        stats?.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      color: "text-primary",
    },
    {
      icon: BarChart3,
      label: "Active Shows",
      value: stats?.activeShows || 0,
      color: "text-orange-400",
    },
    {
      icon: Building2,
      label: "Theaters",
      value: stats?.totalTheaters || 0,
      color: "text-pink-400",
    },
  ];

  const actions = [
    {
      label: "Manage Movies",
      desc: "Add, edit and delete movies",
      to: "/admin/movies",
    },
    {
      label: "Manage Showtimes",
      desc: "Schedule movie screenings",
      to: "/admin/showtimes",
    },
    {
      label: "Manage Theaters",
      desc: "Manage theaters and locations",
      to: "/admin/theaters",
    },
    {
      label: "Manage Screens",
      desc: "Manage screens and capacities",
      to: "/admin/screens",
    },
    {
      label: "Manage Users",
      desc: "View and manage users",
      to: "/admin/users",
    },
    {
      label: "Manage Bookings",
      desc: "Track all bookings",
      to: "/admin/bookings",
    },
  ];

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white font-display">
            Admin Dashboard
          </h1>

          <p className="text-white/40 mt-2">
            Manage your movie booking platform.
          </p>
        </div>

        {/* Stats */}
        {isLoading ? (
          <Spinner className="py-20" size="lg" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-12">
            {cards.map((card) => (
              <div
                key={card.label}
                className="
                  glass-card
                  p-5
                  hover:scale-105
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >
                <card.icon
                  size={28}
                  className={`${card.color} mb-4`}
                />

                <p className="text-white text-3xl font-bold">
                  {card.value}
                </p>

                <p className="text-white/40 text-sm mt-2">
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {actions.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="
                  glass-card
                  p-6
                  hover:border-primary/40
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <h3 className="text-white font-semibold text-lg">
                  {item.label}
                </h3>

                <p className="text-white/40 text-sm mt-2">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;