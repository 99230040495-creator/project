export const indianFishZones = [
    // Gujarat (Moved deeper into Arabian Sea - West)
    { id: 101, lat: 21.0, lng: 68.5, radius: 15000, confidence: 94, type: 'High Potential', locationName: 'Porbandar Deep Sea', species: ['Pomfret', 'Hilsa'], suitableFor: ['big'] },
    { id: 102, lat: 20.0, lng: 69.0, radius: 12000, confidence: 88, type: 'Medium Potential', locationName: 'Veraval Offshore', species: ['Ribbon Fish', 'Croaker'], suitableFor: ['big'] },
    { id: 103, lat: 20.9, lng: 70.0, radius: 5000, confidence: 82, type: 'Nearshore', locationName: 'Veraval Coast', species: ['Prawns', 'Mullet'], suitableFor: ['small', 'big'] }, // Small Boat

    // Maharashtra (Moved West away from coast)
    { id: 201, lat: 19.0, lng: 70.5, radius: 20000, confidence: 92, type: 'High Potential', locationName: 'Mumbai High (Deep)', species: ['Bombay Duck', 'Prawns'], suitableFor: ['big'] },
    { id: 202, lat: 18.0, lng: 71.0, radius: 15000, confidence: 85, type: 'Medium Potential', locationName: 'Alibaug Outer Shelf', species: ['Mackrel', 'Surmai'], suitableFor: ['big'] },
    { id: 203, lat: 16.5, lng: 71.5, radius: 12000, confidence: 90, type: 'High Potential', locationName: 'Ratnagiri Deep', species: ['Kingfish', 'Squid'], suitableFor: ['big'] },
    { id: 204, lat: 18.6, lng: 72.8, radius: 4000, confidence: 78, type: 'Nearshore', locationName: 'Alibaug Coast', species: ['Crab', 'Prawns'], suitableFor: ['small', 'big'] }, // Small Boat

    // Goa (Moved deeper West)
    { id: 301, lat: 15.0, lng: 72.0, radius: 10000, confidence: 95, type: 'High Potential', locationName: 'Goa Deep Sea', species: ['Mackerel', 'Sardines'], suitableFor: ['big'] },
    { id: 302, lat: 15.4, lng: 73.7, radius: 4500, confidence: 85, type: 'Nearshore', locationName: 'Calangute Shelf', species: ['Mackerel', 'Crab'], suitableFor: ['small', 'big'] }, // Small Boat

    // Karnataka (Moved West)
    { id: 401, lat: 14.0, lng: 72.5, radius: 14000, confidence: 89, type: 'Medium Potential', locationName: 'Karwar Offshore', species: ['Mackerel', 'Prawns'], suitableFor: ['big'] },
    { id: 402, lat: 12.5, lng: 73.0, radius: 16000, confidence: 93, type: 'High Potential', locationName: 'Mangalore Outer Banks', species: ['Seer Fish', 'Cuttlefish'], suitableFor: ['big'] },
    { id: 403, lat: 12.8, lng: 74.8, radius: 5000, confidence: 80, type: 'Nearshore', locationName: 'Mangalore Coast', species: ['Sardines', 'Prawns'], suitableFor: ['small', 'big'] }, // Small Boat

    // Kerala (Moved West into Laccadive Sea)
    { id: 501, lat: 11.0, lng: 73.5, radius: 15000, confidence: 91, type: 'High Potential', locationName: 'Kozhikode Deep', species: ['Sardines', 'Mackerel'], suitableFor: ['big'] },
    { id: 502, lat: 9.5, lng: 74.0, radius: 18000, confidence: 96, type: 'High Potential', locationName: 'Kochi Far Offshore', species: ['Pearl Spot', 'Shrimp'], suitableFor: ['big'] },
    { id: 503, lat: 8.0, lng: 75.0, radius: 12000, confidence: 87, type: 'Medium Potential', locationName: 'Vizhinjam Deep', species: ['Tuna', 'Anchovy'], suitableFor: ['big'] },
    { id: 504, lat: 9.9, lng: 76.2, radius: 4000, confidence: 88, type: 'Nearshore', locationName: 'Kochi Backwaters Exit', species: ['Pearl Spot', 'Crab'], suitableFor: ['small', 'big'] }, // Small Boat

    // Tamil Nadu (Moved East into Bay of Bengal)
    { id: 601, lat: 8.0, lng: 79.5, radius: 15000, confidence: 90, type: 'High Potential', locationName: 'Gulf of Mannar Deep', species: ['Tuna', 'Barracuda'], suitableFor: ['big'] },
    { id: 602, lat: 10.0, lng: 81.0, radius: 12000, confidence: 85, type: 'Medium Potential', locationName: 'Palk Strait Deep', species: ['Crab', 'Lobster'], suitableFor: ['big'] },
    { id: 603, lat: 13.0, lng: 82.5, radius: 16000, confidence: 92, type: 'High Potential', locationName: 'Chennai High Seas', species: ['Seer Fish', 'Mullet'], suitableFor: ['big'] },
    { id: 604, lat: 13.0, lng: 80.3, radius: 5000, confidence: 82, type: 'Nearshore', locationName: 'Marina Beach Coast', species: ['Mullet', 'Crab'], suitableFor: ['small', 'big'] }, // Small Boat

    // Andhra Pradesh (Moved East)
    { id: 701, lat: 14.5, lng: 82.5, radius: 14000, confidence: 88, type: 'Medium Potential', locationName: 'Nellore Deep', species: ['Shrimp', 'Catfish'], suitableFor: ['big'] },
    { id: 702, lat: 17.5, lng: 85.0, radius: 18000, confidence: 94, type: 'High Potential', locationName: 'Vizag Outer Shelf', species: ['Tuna', 'Marlin'], suitableFor: ['big'] },
    { id: 703, lat: 17.7, lng: 83.3, radius: 6000, confidence: 85, type: 'Nearshore', locationName: 'Vizag Coast', species: ['Sardines', 'Mackerel'], suitableFor: ['small', 'big'] }, // Small Boat

    // Odisha (Moved East)
    { id: 801, lat: 19.5, lng: 87.5, radius: 13000, confidence: 86, type: 'Medium Potential', locationName: 'Puri Deep Sea', species: ['Hilsa', 'Pomfret'], suitableFor: ['big'] },
    { id: 802, lat: 20.0, lng: 88.5, radius: 12000, confidence: 93, type: 'High Potential', locationName: 'Paradip Offshore', species: ['Prawns', 'Crab'], suitableFor: ['big'] },
    { id: 803, lat: 19.8, lng: 85.8, radius: 5000, confidence: 80, type: 'Nearshore', locationName: 'Puri Coast', species: ['Hilsa', 'Prawns'], suitableFor: ['small', 'big'] }, // Small Boat

    // West Bengal (Moved South into Bay of Bengal)
    { id: 901, lat: 20.5, lng: 89.0, radius: 20000, confidence: 91, type: 'High Potential', locationName: 'Sundarbans Deep', species: ['Hilsa', 'Bhetki'], suitableFor: ['big'] },
    { id: 902, lat: 20.0, lng: 87.5, radius: 12000, confidence: 84, type: 'Medium Potential', locationName: 'Digha Far Offshore', species: ['Pomfret', 'Sea Bass'], suitableFor: ['big'] },
    { id: 903, lat: 21.6, lng: 87.5, radius: 6000, confidence: 89, type: 'Nearshore', locationName: 'Digha Coast', species: ['Bhetki', 'Prawns'], suitableFor: ['small', 'big'] } // Small Boat
];
