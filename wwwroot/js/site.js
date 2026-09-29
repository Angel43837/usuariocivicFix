const locationButton = document.querySelector("#get-location");
const mapElement = document.querySelector("#report-map");
const latitudeInput = document.querySelector("#Latitude");
const longitudeInput = document.querySelector("#Longitude");
const mapFeedback = document.querySelector("#map-feedback");
let locationMap;
let locationMarker;

function setSelectedLocation(latitude, longitude) {
	latitudeInput.value = latitude.toFixed(6);
	longitudeInput.value = longitude.toFixed(6);
	locationMarker?.setLatLng([latitude, longitude]);
	if (!locationMarker) {
		locationMarker = L.marker([latitude, longitude]).addTo(locationMap);
	}
	locationMap.setView([latitude, longitude], 16);
	mapFeedback.textContent = `Punto seleccionado: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} · © OpenStreetMap`;
}

if (mapElement) {
	if (typeof L === "undefined") {
		mapFeedback.textContent = "El mapa no está disponible. Puedes capturar la dirección manualmente.";
	} else {
		locationMap = L.map(mapElement, { scrollWheelZoom: false }).setView([19.4326, -99.1332], 12);
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
		}).addTo(locationMap);

		locationMap.on("click", ({ latlng }) => setSelectedLocation(latlng.lat, latlng.lng));
		if (latitudeInput.value && longitudeInput.value) {
			setSelectedLocation(Number(latitudeInput.value), Number(longitudeInput.value));
		} else {
			mapFeedback.textContent = "Mapa © OpenStreetMap · Selecciona el punto del reporte.";
		}
	}
}

locationButton?.addEventListener("click", () => {
	const feedback = document.querySelector("#location-feedback");
	if (!navigator.geolocation) {
		feedback.textContent = "Este navegador no permite compartir la ubicación.";
		return;
	}

	locationButton.disabled = true;
	feedback.textContent = "Obteniendo ubicación...";
	navigator.geolocation.getCurrentPosition(
		({ coords }) => {
			if (locationMap) {
				setSelectedLocation(coords.latitude, coords.longitude);
			} else {
				latitudeInput.value = coords.latitude.toFixed(6);
				longitudeInput.value = coords.longitude.toFixed(6);
			}
			const location = document.querySelector("#Location");
			if (!location.value.trim()) {
				location.value = `Coordenadas ${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
			}
			feedback.textContent = "Coordenadas agregadas al reporte.";
			locationButton.disabled = false;
		},
		() => {
			feedback.textContent = "No se pudo obtener la ubicación. Puedes escribir la dirección.";
			locationButton.disabled = false;
		},
		{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
	);
});

const photoInput = document.querySelector("#Photo");
const photoPreview = document.querySelector("#photo-preview");
let previewUrl;

photoInput?.addEventListener("change", () => {
	if (previewUrl) URL.revokeObjectURL(previewUrl);
	const [photo] = photoInput.files;
	if (!photo) {
		photoPreview.hidden = true;
		photoPreview.removeAttribute("src");
		return;
	}

	previewUrl = URL.createObjectURL(photo);
	photoPreview.src = previewUrl;
	photoPreview.hidden = false;
});
