"use client";

import type { TicketData } from "@/lib/data";

type Labels = {
  sectionTitle: string;
  sectionSubtitle: string;
  buyButton: string;
  soldOut: string;
};

export default function TicketSection({ data, labels, locale }: { data: TicketData; labels: Labels; locale: string }) {
  const isEn = locale === "en";

  return (
    <section id="ticket" className="relative overflow-hidden bg-gradient-to-br from-[#0a0a2e] via-[#1a1050] to-[#0d0d3a] py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#3D7FE0]/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-[#C94BEA]/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-[#C94BEA]/80">
            {labels.sectionSubtitle}
          </p>
          <h2 className="text-3xl font-black text-white md:text-4xl">
            {labels.sectionTitle}
          </h2>
        </div>

        {/* Ticket cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {data.items.map((ticket) => {
            const name = (isEn && ticket.nameEn) ? ticket.nameEn : ticket.name;
            const price = (isEn && ticket.priceEn) ? ticket.priceEn : ticket.price;
            const description = (isEn && ticket.descriptionEn) ? ticket.descriptionEn : ticket.description;

            return (
              <div
                key={ticket.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all ${
                  ticket.isSoldOut
                    ? "border-white/5 bg-white/5"
                    : "border-white/10 bg-white/[0.07] hover:border-[#C94BEA]/40 hover:bg-white/10"
                }`}
              >
                {/* Ticket top accent */}
                <div className={`h-1.5 w-full ${ticket.isSoldOut ? "bg-gray-600" : "bg-gradient-to-r from-[#3D7FE0] to-[#C94BEA]"}`} />

                <div className="p-6">
                  <h3 className={`text-lg font-bold ${ticket.isSoldOut ? "text-white/40" : "text-white"}`}>
                    {name}
                  </h3>

                  <div className={`mt-3 text-3xl font-black ${ticket.isSoldOut ? "text-white/30" : "text-white"}`}>
                    {price}
                  </div>

                  {description && (
                    <p className={`mt-3 whitespace-pre-wrap text-sm ${ticket.isSoldOut ? "text-white/20" : "text-white/50"}`}>
                      {description}
                    </p>
                  )}

                  <div className="mt-5">
                    {ticket.isSoldOut ? (
                      <span className="inline-block rounded-lg bg-white/10 px-6 py-3 text-sm font-bold text-white/30">
                        {labels.soldOut}
                      </span>
                    ) : ticket.purchaseUrl ? (
                      <a
                        href={ticket.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3D7FE0] to-[#C94BEA] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-xl"
                      >
                        {labels.buyButton}
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Sold out overlay */}
                {ticket.isSoldOut && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rotate-[-15deg] text-4xl font-black tracking-wider text-white/10">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Note */}
        {(data.note || data.noteEn) && (
          <div className="mt-8">
            <p className="whitespace-pre-wrap text-center text-xs text-white/30">
              {(isEn && data.noteEn) ? data.noteEn : data.note}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
