// map.js
// Initialiser la carte à Paris avec un niveau de zoom plus élevé
var map = L.map('map').setView([48.8566, 2.3522], 14);

// Ajouter un calque de tuiles OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Fonction pour ajuster les paramètres de la carte selon la taille de l'écran
function adjustMapForMobile() {
    if (window.innerWidth < 768) {
        map.zoomControl.remove(); // Supprime le contrôle de zoom sur les petits écrans
        map.touchZoom.enable();    // Active le zoom tactile
        map.scrollWheelZoom.disable(); // Désactive le zoom à la molette de la souris
        console.log("Paramètres ajustés pour mobile : Zoom tactile activé, molette désactivée.");
    } else {
        map.touchZoom.disable();    // Désactive le zoom tactile sur les grands écrans
        map.scrollWheelZoom.enable(); // Active le zoom à la molette sur les grands écrans
        console.log("Paramètres ajustés pour desktop : Zoom tactile désactivé, molette activée.");
    }
}

// Ajuster la carte lors du chargement initial
adjustMapForMobile();

// Écouter les changements de taille de la fenêtre
window.addEventListener('resize', function() {
    map.invalidateSize(); // Ajuste la taille de la carte automatiquement
    adjustMapForMobile(); // Ajuster les paramètres de la carte selon la taille de l'écran
});

// Cache pour stocker les résultats API par cellules
let arbresCache = {};

// Taille des cellules en degrés (ajuste selon le niveau de précision désiré)
const CELL_SIZE = 0.01; 

// Fonction pour générer une clé de cellule basée sur une latitude et une longitude
function getCellKey(lat, lng) {
    const latCell = Math.floor(lat / CELL_SIZE) * CELL_SIZE;
    const lngCell = Math.floor(lng / CELL_SIZE) * CELL_SIZE;
    return `${latCell}_${lngCell}`;
}

// Fonction pour gérer la visibilité des marqueurs en fonction des limites de la carte
function manageArbresVisibility() {
    const bounds = map.getBounds();
    console.log("Gestion de la visibilité des marqueurs pour les nouvelles limites de la carte :", bounds);

    // Parcourir le cache et ajuster la visibilité des marqueurs
    Object.keys(arbresCache).forEach(key => {
        arbresCache[key].forEach(marker => {
            if (bounds.contains(marker.getLatLng())) {
                marker.addTo(map);
            } else {
                map.removeLayer(marker);
            }
        });
    });
}

// Fonction pour récupérer les données des arbres depuis l'API pour les cellules non en cache
async function fetchArbres() {
    // Obtenez les limites de la carte visible
    const bounds = map.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    // Liste des cellules couvertes par la zone visible de la carte
    let cellsToFetch = [];

    for (let lat = southWest.lat; lat <= northEast.lat; lat += CELL_SIZE) {
        for (let lng = southWest.lng; lng <= northEast.lng; lng += CELL_SIZE) {
            const cellKey = getCellKey(lat, lng);
            if (!arbresCache[cellKey]) {
                cellsToFetch.push(cellKey);
            }
        }
    }

    // Si toutes les cellules sont déjà en cache, rien à faire
    if (cellsToFetch.length === 0) {
        console.log("Toutes les cellules visibles sont déjà dans le cache.");
        manageArbresVisibility();
        return;
    }

    console.log(`Appel API pour ${cellsToFetch.length} nouvelles cellules.`);

    const limit = 1000; // Nombre maximum d'arbres par appel

    try {
        // Préparez les paramètres de la requête avec les limites géographiques
        const params = new URLSearchParams({
            'rows': limit,
            'geofilter.bbox': `${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng}`,
        });

        console.log("Requête envoyée à l'API avec les paramètres :", params.toString());

        // Faites la requête à l'API avec les limites géographiques
        const response = await fetch(`https://opendata.paris.fr/api/records/1.0/search/?dataset=les-arbres&${params.toString()}`);
        const data = await response.json();

        // Affichez la réponse complète dans la console pour inspecter la structure
        console.log(data);

        // Vérifiez si les données existent dans la structure attendue
        if (data.records && Array.isArray(data.records)) {
            const arbres = data.records;

            console.log(`API retourné ${arbres.length} arbres.`);

            // Parcourir et afficher les arbres sur la carte
            arbres.forEach(arb => {
                const lat = arb.fields.geo_point_2d[0]; // Latitude
                const lng = arb.fields.geo_point_2d[1]; // Longitude
                const nom = arb.fields.libellefrancais || "Arbre"; // Nom de l'arbre
                const adresse = arb.fields.adresse || "Adresse inconnue"; // Adresse de l'arbre

                if (lat !== undefined && lng !== undefined) {
                    const cellKey = getCellKey(lat, lng);
                    const circle = L.circleMarker([lat, lng], {
                        color: 'green',      // Couleur de la bordure
                        fillColor: 'green',  // Couleur de remplissage
                        fillOpacity: 0.8,    // Opacité du remplissage
                        radius: 5,           // Rayon du cercle
                        weight: 2,           // Épaisseur de la bordure (ajustez cette valeur)
                        opacity: 0.5         // Opacité de la bordure
                    }).bindPopup(`<b>${nom}</b><br>${adresse}`);

                    circle.addTo(map);

                    if (!arbresCache[cellKey]) {
                        arbresCache[cellKey] = [];
                    }
                    arbresCache[cellKey].push(circle); // Ajouter le marqueur au cache de la cellule
                } else {
                    console.warn("Coordonnées manquantes ou invalides pour un arbre :", arb);
                }
            });

            console.log(`Les arbres ont été ajoutés aux cellules : ${cellsToFetch.join(', ')}`);
        } else {
            console.error("La structure des données est incorrecte.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }

    // Gérer la visibilité des arbres
    manageArbresVisibility();
}

// Fonction de debouncing
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Appeler la fonction fetchArbres avec un debouncer lors du mouvement de la carte
map.on('moveend', debounce(fetchArbres, 300));

// Initialiser la récupération des arbres à la première ouverture de la carte
fetchArbres();