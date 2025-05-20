
// Default emergency contacts for Chinhoyi, Zimbabwe
export const chinhoyiEmergencyContacts = [
  {
    id: "chinhoyi-police",
    name: "Chinhoyi Police",
    phone: "+263 67 22111",
    type: "emergency",
    is_favorite: true,
    created_at: new Date().toISOString(),
    user_id: null // null user_id indicates this is a system default contact
  },
  {
    id: "chinhoyi-fire",
    name: "Chinhoyi Fire Department",
    phone: "+263 67 22911",
    type: "emergency",
    is_favorite: true,
    created_at: new Date().toISOString(),
    user_id: null
  },
  {
    id: "chinhoyi-ambulance",
    name: "Chinhoyi Ambulance Services",
    phone: "+263 67 22444",
    type: "emergency",
    is_favorite: true,
    created_at: new Date().toISOString(),
    user_id: null
  },
  {
    id: "chinhoyi-hospital",
    name: "Chinhoyi Provincial Hospital",
    phone: "+263 67 22512",
    type: "emergency",
    is_favorite: true,
    created_at: new Date().toISOString(),
    user_id: null
  },
  {
    id: "chinhoyi-towing",
    name: "Chinhoyi Towing Services",
    phone: "+263 67 22999",
    type: "service",
    is_favorite: false,
    created_at: new Date().toISOString(),
    user_id: null
  },
  {
    id: "marondera-municipality",
    name: "Chinhoyi Municipality",
    phone: "+263 67 22222",
    type: "service",
    is_favorite: false,
    created_at: new Date().toISOString(),
    user_id: null
  }
];
