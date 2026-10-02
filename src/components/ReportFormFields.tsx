"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { CATEGORIES, PRIORITIES } from "@/lib/types";

export default function ReportFormFields({
  initialName,
  error,
}: {
  initialName: string;
  error?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const latRef = useRef<HTMLInputElement>(null);
  const lngRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  const [mapFeedback, setMapFeedback] = useState(
    "Mapa © OpenStreetMap · Selecciona el punto del reporte."
  );
  const [locationFeedback, setLocationFeedback] = useState(
    "Puedes escribir una dirección, elegir un punto en el mapa o compartir tu ubicación actual."
  );
  const [gettingLocation, setGettingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function setSelectedLocation(latitude: number, longitude: number) {
    if (latRef.current) latRef.current.value = latitude.toFixed(6);
    if (lngRef.current) lngRef.current.value = longitude.toFixed(6);

    const map = mapRef.current;
    if (map) {
      import("leaflet").then(({ default: L }) => {
        if (!markerRef.current) {
          markerRef.current = L.marker([latitude, longitude]).addTo(map);
        } else {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        map.setView([latitude, longitude], 16);
      });
    }

    setMapFeedback(
      `Punto seleccionado: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} · © OpenStreetMap`
    );
  }

  useEffect(() => {
    let cancelled = false;

    import("leaflet").then(({ default: L }) => {
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, { scrollWheelZoom: false }).setView(
        [19.4326, -99.1332],
        12
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      map.on("click", (event) => setSelectedLocation(event.latlng.lat, event.latlng.lng));
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationFeedback("Este navegador no permite compartir la ubicación.");
      return;
    }

    setGettingLocation(true);
    setLocationFeedback("Obteniendo ubicación...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setSelectedLocation(coords.latitude, coords.longitude);
        if (locationRef.current && !locationRef.current.value.trim()) {
          locationRef.current.value = `Coordenadas ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
        }
        setLocationFeedback("Coordenadas agregadas al reporte.");
        setGettingLocation(false);
      },
      () => {
        setLocationFeedback("No se pudo obtener la ubicación. Puedes escribir la dirección.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <>
      {error && <div className="validation-summary">{error}</div>}
      <div className="form-grid">
        <div className="field field--wide">
          <label htmlFor="citizenName">Nombre</label>
          <input
            id="citizenName"
            name="citizenName"
            defaultValue={initialName}
            autoComplete="name"
            placeholder="Nombre de quien reporta"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" defaultValue="" required>
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Prioridad</label>
          <select id="priority" name="priority" defaultValue="Media">
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="field field--wide">
          <label htmlFor="location">Ubicación</label>
          <div className="location-input-row">
            <input
              id="location"
              name="location"
              ref={locationRef}
              autoComplete="street-address"
              placeholder="Calle, número, colonia o referencia"
              required
            />
            <button
              className="button button--quiet location-button"
              type="button"
              onClick={handleUseMyLocation}
              disabled={gettingLocation}
              title="Usar mi ubicación"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span>Mi ubicación</span>
            </button>
          </div>
          <input type="hidden" name="latitude" ref={latRef} />
          <input type="hidden" name="longitude" ref={lngRef} />
          <div
            className="map-picker"
            ref={mapContainerRef}
            role="application"
            aria-label="Mapa para seleccionar la ubicación del reporte"
          />
          <span className="field-hint">{locationFeedback}</span>
          <span className="map-attribution">{mapFeedback}</span>
        </div>
        <div className="field field--wide">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            minLength={12}
            maxLength={1500}
            placeholder="¿Qué ocurre? ¿Desde cuándo? Agrega detalles que ayuden a localizar el problema."
            required
          />
        </div>
        <div className="field field--wide">
          <label htmlFor="photo">Fotografía</label>
          <div className="upload-control">
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
            />
            <span className="field-hint">JPG, PNG o WEBP · máximo 5 MB</span>
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="photo-preview" src={photoPreview} alt="Vista previa de la fotografía" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
