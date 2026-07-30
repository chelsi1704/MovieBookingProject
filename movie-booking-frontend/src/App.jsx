import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ManageBookingsPage from "./pages/admin/ManageBookingsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const VerifyOtpPage = lazy(() => import("./pages/auth/VerifyOtpPage"));
const ForgotPasswordPage = lazy(
  () => import("./pages/auth/ForgotPasswordPage"),
);
const OAuth2CallbackPage = lazy(
  () => import("./pages/auth/OAuth2CallbackPage"),
);

// Movie pages
const HomePage = lazy(() => import("./pages/movies/HomePage"));
const MovieDetailPage = lazy(() => import("./pages/movies/MovieDetailPage"));
const SearchPage = lazy(() => import("./pages/movies/SearchPage"));

// Booking pages
const SelectShowtimePage = lazy(
  () => import("./pages/booking/SelectShowtimePage"),
);
const SeatSelectionPage = lazy(
  () => import("./pages/booking/SeatSelectionPage"),
);
const ReviewBookingPage = lazy(
  () => import("./pages/booking/ReviewBookingPage"),
);
const PaymentPage = lazy(() => import("./pages/booking/PaymentPage"));
const BookingConfirmedPage = lazy(
  () => import("./pages/booking/BookingConfirmedPage"),
);

// User pages
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"));
const MyBookingsPage = lazy(() => import("./pages/user/MyBookingsPage"));
const MyTicketsPage = lazy(() => import("./pages/user/MyTicketsPage"));
const WishlistPage = lazy(() => import("./pages/user/WishlistPage"));
const NotificationsPage = lazy(() => import("./pages/user/NotificationsPage"));

// Admin pages
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const ManageMoviesPage = lazy(() => import("./pages/admin/ManageMoviesPage"));
const ManageTheatersPage = lazy(
  () => import("./pages/admin/ManageTheatersPage"),
);
const ManageShowtimesPage = lazy(
  () => import("./pages/admin/ManageShowtimesPage"),
);
const ManageUsersPage = lazy(() => import("./pages/admin/ManageUsersPage"));
const ManageOffersPage = lazy(() => import("./pages/admin/ManageOffersPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-12 h-12 border-4 border-primary/30
                      border-t-primary rounded-full animate-spin"
      />
      <p className="text-white/60 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    // QueryClientProvider — React Query available everywhere
    <QueryClientProvider client={queryClient}>
      {/* ThemeProvider — dark/light mode available everywhere */}
      <ThemeProvider>
        {/* AuthProvider — user/token available everywhere */}
        <AuthProvider>
          <BrowserRouter>
            {/* Toast notifications — top-right corner */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "rgba(20,20,20,0.95)",
                  color: "#fff",
                  border: "1px solid rgba(229,9,20,0.3)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "10px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#e50914",
                    secondary: "#fff",
                  },
                },
              }}
            />

            {/* Suspense wraps all lazy routes */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ── PUBLIC ROUTES ─────────────────── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/movies/:id" element={<MovieDetailPage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                {/* Google OAuth2 redirect callback */}
                <Route
                  path="/oauth2/callback"
                  element={<OAuth2CallbackPage />}
                />

                {/* ── PROTECTED ROUTES (login required) ─ */}
                <Route
                  path="/booking/:movieId"
                  element={
                    <ProtectedRoute>
                      <SelectShowtimePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seats/:showtimeId"
                  element={
                    <ProtectedRoute>
                      <SeatSelectionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review-booking"
                  element={
                    <ProtectedRoute>
                      <ReviewBookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/booking-confirmed"
                  element={
                    <ProtectedRoute>
                      <BookingConfirmedPage />
                    </ProtectedRoute>
                  }
                />

                {/* User profile routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedRoute>
                      <MyBookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-tickets/:bookingId"
                  element={
                    <ProtectedRoute>
                      <MyTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  }
                />

                {/* ── ADMIN ROUTES (ADMIN role required) ─ */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/movies"
                  element={
                    <AdminRoute>
                      <ManageMoviesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/theaters"
                  element={
                    <AdminRoute>
                      <ManageTheatersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/showtimes"
                  element={
                    <AdminRoute>
                      <ManageShowtimesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <ManageUsersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/offers"
                  element={
                    <AdminRoute>
                      <ManageOffersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/bookings"
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <ManageBookingsPage />
                    </ProtectedRoute>
                  }
                />
                {/* ── 404 FALLBACK ──────────────────── */}
                {/* Any unknown URL redirects to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
