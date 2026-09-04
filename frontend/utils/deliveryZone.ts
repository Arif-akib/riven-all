import { steadfastLocations } from "@/store/address";

interface Address {
  city: string;    // Division
  zip: string;     // District
  country: string; // Area
}

export const getShippingFee = (address: Address): number => {
  if (!address || !address.city || !address.zip || !address.country) {
    return 120; // Default fallback fee (outside Dhaka)
  }

  const matchedLocation = steadfastLocations.find(
    (loc: any) =>
      loc.division.toLowerCase() === address.city.toLowerCase() &&
      loc.district.toLowerCase() === address.zip.toLowerCase() &&
      (loc.area.toLowerCase() === address.country.toLowerCase() ||
        loc.name.toLowerCase() === address.country.toLowerCase())
  );

  const zone = matchedLocation?.zone || "outside_dhaka";

  // Zone to price mapping
  const shippingRates: Record<string, number> = {
    inside_dhaka: 70,
    dhaka_suburban: 100,
    outside_dhaka: 120,
  };

  return shippingRates[zone] ?? 120;
};