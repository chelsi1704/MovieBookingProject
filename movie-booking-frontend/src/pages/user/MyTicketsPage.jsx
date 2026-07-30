import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QrCode } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Spinner from "../../components/common/Spinner";
import bookingApi from "../../api/bookingApi";

const MyTicketsPage = () => {
  const { bookingId } = useParams();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ["tickets", bookingId],
    queryFn: () =>
      bookingApi.getTickets(bookingId).then((r) => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark">
        <Navbar />
        <Spinner className="py-20" size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold text-white mb-6">
          My Tickets
        </h1>

        <div className="space-y-6">
          {tickets?.map((ticket) => (
            
            <div
              key={ticket.id}
              className="glass-card p-5 flex gap-4"
            >
              {ticket.moviePoster && (
                <img
                  src={ticket.moviePoster}
                  alt={ticket.movieTitle}
                  className="w-20 h-28 object-cover rounded-lg border border-white/10"
                />
              )}

              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">
                  {ticket.movieTitle}
                </h2>

                <p className="text-white/50 text-sm mt-1">
                  {ticket.theaterName}
                </p>

                <p className="text-white/40 text-xs">
                  {ticket.screenName}
                </p>

                <div className="mt-4 space-y-1">
                  <p className="text-white text-sm">
                    Seat :
                    <span className="text-primary ml-1">
                      {ticket.rowLabel}
                      {ticket.seatNumber}
                    </span>
                  </p>

                  <p className="text-white text-sm">
                    Category :
                    <span className="text-primary ml-1">
                      {ticket.seatCategory}
                    </span>
                  </p>

                  <p className="text-white text-sm">
                    Date :
                    <span className="text-primary ml-1">
                      {ticket.showDate}
                    </span>
                  </p>

                  <p className="text-white text-sm">
                    Time :
                    <span className="text-primary ml-1">
                      {ticket.showTime}
                    </span>
                  </p>

                  <p className="text-white text-sm">
                    Language :
                    <span className="text-primary ml-1">
                      {ticket.language}
                    </span>
                  </p>

                  <p className="text-white text-sm">
                    Booking Ref :
                    <span className="text-primary ml-1 font-mono">
                      {ticket.bookingRef}
                    </span>
                  </p>

                  <p className="text-primary font-mono text-xs mt-2">
                    {ticket.ticketCode}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
                  <QrCode size={50} className="text-gray-800" />
                </div>

                {ticket.ticketPdfUrl && (
                  <a
                    href={ticket.ticketPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTicketsPage;