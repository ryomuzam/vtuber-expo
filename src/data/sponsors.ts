export type Sponsor = {
  id: string;
  name: string;
  logo?: string;
  isPublic?: boolean;
};

export const sponsors: Sponsor[] = [];

export type Tieup = {
  id: string;
  name: string;
  logo?: string;
  isPublic?: boolean;
};

export const tieups: Tieup[] = [
  { id: "vket", name: "Vket", logo: "/images/tieups/vket.png" },
  { id: "mocopi", name: "mocopi", logo: "/images/tieups/mocopi.png" },
  { id: "reality", name: "REALITY", logo: "/images/tieups/reality.png" },
  { id: "iriam", name: "IRIAM", logo: "/images/tieups/iriam.svg" },
  { id: "showroom", name: "SHOWROOM", logo: "/images/tieups/showroom.png" },
];
