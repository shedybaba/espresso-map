"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  lat: number
  lon: number
  type: "past" | "upcoming"
  title: string
  date: string
  attendees?: number
  description?: string
}

const events: Event[] = [
  {
    id: "1",
    lat: 39.7392,
    lon: -104.9903,
    type: "past",
    title: "Denver Coffee Summit 2023",
    date: "May 15, 2023",
    attendees: 180,
    description: "Mountain coffee culture exploration",
  },
  {
    id: "2",
    lat: 37.7749,
    lon: -122.4194,
    type: "past",
    title: "San Francisco Espresso Expo 2023",
    date: "Aug 22, 2023",
    attendees: 320,
    description: "Tech meets coffee innovation",
  },
  {
    id: "3",
    lat: 40.7128,
    lon: -74.006,
    type: "past",
    title: "New York Coffee Festival 2023",
    date: "Sep 8, 2023",
    attendees: 500,
    description: "Largest coffee trade show in North America",
  },
  {
    id: "4",
    lat: 43.5528,
    lon: 7.0174,
    type: "past",
    title: "Cannes Coffee Culture 2023",
    date: "Oct 12, 2023",
    attendees: 150,
    description: "French Riviera coffee experience",
  },
  {
    id: "5",
    lat: 13.7563,
    lon: 100.5018,
    type: "past",
    title: "Bangkok Barista Championship 2023",
    date: "Nov 18, 2023",
    attendees: 200,
    description: "Southeast Asian coffee mastery",
  },
  {
    id: "6",
    lat: 50.8503,
    lon: 4.3517,
    type: "past",
    title: "Brussels Coffee Convention 2024",
    date: "Feb 14, 2024",
    attendees: 280,
    description: "European coffee industry gathering",
  },
  {
    id: "7",
    lat: 52.52,
    lon: 13.405,
    type: "past",
    title: "Berlin Espresso Workshop 2024",
    date: "Apr 20, 2024",
    attendees: 160,
    description: "German precision in coffee brewing",
  },
  {
    id: "8",
    lat: 37.5665,
    lon: 126.978,
    type: "upcoming",
    title: "Seoul Coffee Innovation 2025",
    date: "Mar 15, 2025",
    attendees: 250,
    description: "Korean coffee culture and technology",
  },
  {
    id: "9",
    lat: -34.6118,
    lon: -58.396,
    type: "upcoming",
    title: "Buenos Aires Café Festival 2025",
    date: "Jun 22, 2025",
    attendees: 190,
    description: "South American coffee heritage",
  },
]

export function EspressoWorldMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current && !mapInstance) {
        const map = L.map(mapRef.current).setView([20.0, 0.0], 2)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        events.forEach((event) => {
          const color = event.type === "past" ? "#f59e0b" : "#0891b2"
          const marker = L.circleMarker([event.lat, event.lon], {
            radius: 14,
            fillColor: color,
            color: "#ffffff",
            weight: 4,
            opacity: 1,
            fillOpacity: 0.9,
            className: "marker-3d",
          }).addTo(map)

          marker.on("click", () => {
            setSelectedEvent(event)
          })

          marker.bindTooltip(event.title, {
            permanent: false,
            direction: "top",
            offset: [0, -20],
            className: "custom-tooltip-3d",
          })
        })

        setMapInstance(map)
      }
    }

    initMap()

    return () => {
      if (mapInstance) {
        mapInstance.remove()
        setMapInstance(null)
      }
    }
  }, [mapInstance])

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#b67237" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-33 h-21 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-contain"
                style={{
                  backgroundImage: `url('/espresso-logo.webp')`,
                }}
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              {"Espresso World Map".split("").map((letter, index) => (
                <span
                  key={index}
                  className="inline-block transition-all duration-100 ease-out hover:scale-125 hover:-translate-y-1 cursor-default"
                  style={{
                    transitionDelay: `${index * 10}ms`,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </h1>
            <p className="text-white text-lg">Track Espresso events around the globe</p>
          </div>
        </div>

        <Card className="inline-flex items-center gap-4 p-6 bg-card/90 backdrop-blur-md border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center gap-3 w-32">
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-amber-500 shadow-lg" />
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-amber-400 animate-ping opacity-30" />
            </div>
            <span className="text-sm font-semibold text-card-foreground leading-none">Past Events</span>
          </div>
          <div className="flex items-center gap-3 w-32">
            <div className="relative flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-primary shadow-lg" />
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-primary animate-ping opacity-30" />
            </div>
            <span className="text-sm font-semibold text-card-foreground leading-none">Upcoming Events</span>
          </div>
        </Card>
      </div>

      <div className="relative z-10 mx-6 mb-6 perspective-1000">
        <Card className="overflow-hidden border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:rotate-x-2">
          <div className="relative">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-contain opacity-8"
                style={{
                  backgroundImage: `url('/espresso-logo.webp')`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  filter: "blur(0.5px) brightness(1.1)",
                }}
              />
            </div>
            <div
              ref={mapRef}
              className="h-[600px] w-full relative z-10 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(8, 145, 178, 0.02) 0%, rgba(99, 102, 241, 0.02) 100%)",
              }}
            />
          </div>
        </Card>
      </div>

      {selectedEvent && (
        <div
          className="fixed right-6 top-1/2 -translate-y-1/2 z-20 w-80"
          style={{ animation: "slide-in 0.3s ease-out" }}
        >
          <Card className="p-6 bg-popover/95 backdrop-blur-lg border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <Badge
                variant={selectedEvent.type === "past" ? "secondary" : "default"}
                className="shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                {selectedEvent.type === "past" ? "Past Event" : "Upcoming Event"}
              </Badge>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted/50"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold mb-2 text-popover-foreground">{selectedEvent.title}</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground p-2 rounded-lg bg-muted/30">
                <span className="w-5 h-5 text-center text-base">📅</span>
                <span className="font-medium">{selectedEvent.date}</span>
              </div>

              {selectedEvent.attendees && (
                <div className="flex items-center gap-3 text-muted-foreground p-2 rounded-lg bg-muted/30">
                  <span className="w-5 h-5 text-center text-base">👥</span>
                  <span className="font-medium">{selectedEvent.attendees} attendees</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-muted-foreground p-2 rounded-lg bg-muted/30">
                <span className="w-5 h-5 text-center text-base">📍</span>
                <span className="font-medium">
                  {selectedEvent.lat.toFixed(4)}, {selectedEvent.lon.toFixed(4)}
                </span>
              </div>
            </div>

            {selectedEvent.description && (
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

      <style jsx global>{`
        .custom-tooltip-3d {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 12px !important;
          padding: 12px 16px !important;
          font-weight: 600 !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          backdrop-filter: blur(8px) !important;
        }
        
        .leaflet-tooltip-top {
          margin-top: -10px !important;
        }
        
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95) !important;
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          backdrop-filter: blur(12px) !important;
        }

        .marker-3d {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) !important;
          transition: all 0.2s ease !important;
        }

        .marker-3d:hover {
          filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15)) !important;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .hover\\:rotate-x-2:hover {
          transform: rotateX(2deg) translateY(-8px);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
