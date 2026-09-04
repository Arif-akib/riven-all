const steadfastLocations = [
  // INSIDE DHAKA
  { id: 1, name: "Dhanmondi", area: "Dhanmondi", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 2, name: "Kalabagan", area: "Kalabagan", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 3, name: "Lalbagh", area: "Lalbagh", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 4, name: "Kotwali", area: "Kotwali", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 5, name: "Wari", area: "Wari", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 6, name: "Sutrapur", area: "Sutrapur", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 7, name: "Ramna", area: "Ramna", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 8, name: "Paltan", area: "Paltan", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 9, name: "Motijheel", area: "Motijheel", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 10, name: "Shahbagh", area: "Shahbagh", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 11, name: "Tejgaon", area: "Tejgaon", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 12, name: "Mohammadpur", area: "Mohammadpur", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 13, name: "Adabor", area: "Adabor", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 14, name: "Sher-e-Bangla Nagar", area: "Sher-e-Bangla Nagar", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 15, name: "Mirpur", area: "Mirpur", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 16, name: "Pallabi", area: "Pallabi", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 17, name: "Kafrul", area: "Kafrul", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 18, name: "Darus Salam", area: "Darus Salam", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 19, name: "Uttara", area: "Uttara", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 20, name: "Airport", area: "Airport", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 21, name: "Gulshan", area: "Gulshan", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 22, name: "Banani", area: "Banani", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 23, name: "Badda", area: "Badda", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 24, name: "Rampura", area: "Rampura", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 25, name: "Khilgaon", area: "Khilgaon", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 26, name: "Jatrabari", area: "Jatrabari", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 27, name: "Demra", area: "Demra", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },
  { id: 28, name: "Shyampur", area: "Shyampur", district: "Dhaka", division: "Dhaka", zone: "inside_dhaka" },

  // DHAKA SUBURBAN
  { id: 101, name: "Savar", area: "Savar", district: "Dhaka", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 102, name: "Ashulia", area: "Ashulia", district: "Dhaka", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 103, name: "Keraniganj", area: "Keraniganj", district: "Dhaka", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 104, name: "Dohar", area: "Dohar", district: "Dhaka", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 105, name: "Nawabganj", area: "Nawabganj", district: "Dhaka", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 106, name: "Sreenagar", area: "Sreenagar", district: "Munshiganj", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 107, name: "Narayanganj Sadar", area: "Narayanganj Sadar", district: "Narayanganj", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 108, name: "Fatullah", area: "Fatullah", district: "Narayanganj", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 109, name: "Rupganj", area: "Rupganj", district: "Narayanganj", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 110, name: "Sonargaon", area: "Sonargaon", district: "Narayanganj", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 111, name: "Gazipur Sadar", area: "Gazipur Sadar", district: "Gazipur", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 112, name: "Tongi", area: "Tongi", district: "Gazipur", division: "Dhaka", zone: "dhaka_suburban" },
  { id: 113, name: "Kaliakair", area: "Kaliakair", district: "Gazipur", division: "Dhaka", zone: "dhaka_suburban" },

  // OUTSIDE DHAKA
  { id: 201, name: "Chattogram Sadar", area: "Chattogram Sadar", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 202, name: "Kotwali", area: "Kotwali", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 203, name: "Panchlaish", area: "Panchlaish", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 204, name: "Double Mooring", area: "Double Mooring", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 205, name: "Khulshi", area: "Khulshi", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 206, name: "Halishahar", area: "Halishahar", district: "Chattogram", division: "Chattogram", zone: "outside_dhaka" },
  { id: 207, name: "Rajshahi Sadar", area: "Rajshahi Sadar", district: "Rajshahi", division: "Rajshahi", zone: "outside_dhaka" },
  { id: 208, name: "Boalia", area: "Boalia", district: "Rajshahi", division: "Rajshahi", zone: "outside_dhaka" },
  { id: 209, name: "Khulna Sadar", area: "Khulna Sadar", district: "Khulna", division: "Khulna", zone: "outside_dhaka" },
  { id: 210, name: "Sonadanga", area: "Sonadanga", district: "Khulna", division: "Khulna", zone: "outside_dhaka" },
  { id: 211, name: "Sylhet Sadar", area: "Sylhet Sadar", district: "Sylhet", division: "Sylhet", zone: "outside_dhaka" },
  { id: 212, name: "Kotwali", area: "Kotwali", district: "Sylhet", division: "Sylhet", zone: "outside_dhaka" },
  { id: 213, name: "Barishal Sadar", area: "Barishal Sadar", district: "Barishal", division: "Barishal", zone: "outside_dhaka" },
  { id: 214, name: "Rangpur Sadar", area: "Rangpur Sadar", district: "Rangpur", division: "Rangpur", zone: "outside_dhaka" },
  { id: 215, name: "Mymensingh Sadar", area: "Mymensingh Sadar", district: "Mymensingh", division: "Mymensingh", zone: "outside_dhaka" },
  { id: 216, name: "Comilla Sadar", area: "Comilla Sadar", district: "Cumilla", division: "Chattogram", zone: "outside_dhaka" },
  { id: 217, name: "Bogura Sadar", area: "Bogura Sadar", district: "Bogura", division: "Rajshahi", zone: "outside_dhaka" },
  { id: 218, name: "Jessore Sadar", area: "Jashore Sadar", district: "Jashore", division: "Khulna", zone: "outside_dhaka" },
  { id: 219, name: "Cox's Bazar Sadar", area: "Cox's Bazar Sadar", district: "Cox's Bazar", division: "Chattogram", zone: "outside_dhaka" },
];

const SHIPPING_RATES = {
  inside_dhaka: 70,
  dhaka_suburban: 100,
  outside_dhaka: 120,
};

exports.getShippingFee = (address) => {
  const DEFAULT_FEE = 120;

  if (!address || !address.city || !address.zip || !address.country) {
    return DEFAULT_FEE;
  }

  const userCity = address.city.trim().toLowerCase();
  const userZip = address.zip.trim().toLowerCase();
  const userCountry = address.country.trim().toLowerCase();

  const matchedLocation = steadfastLocations.find((loc) => {
    const locDivision = loc.division.trim().toLowerCase();
    const locDistrict = loc.district.trim().toLowerCase();
    const locArea = loc.area.trim().toLowerCase();
    const locName = loc.name.trim().toLowerCase();

    return (
      locDivision === userCity &&
      locDistrict === userZip &&
      (locArea === userCountry || locName === userCountry)
    );
  });

  const zone = matchedLocation?.zone || "outside_dhaka";
  return SHIPPING_RATES[zone] ?? DEFAULT_FEE;
};