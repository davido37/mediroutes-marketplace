"use client";

interface VendorLogoProps {
  vendor: "mediroutes" | "uber" | "lyft" | "marketplace" | "modivcare" | "mtm" | "saferide" | "alivi";
  size?: number;
  className?: string;
}

export function VendorLogo({ vendor, size = 32, className = "" }: VendorLogoProps) {
  switch (vendor) {
    case "mediroutes":
      return <MediRoutesLogo size={size} className={className} />;
    case "uber":
      return <UberLogo size={size} className={className} />;
    case "lyft":
      return <LyftLogo size={size} className={className} />;
    case "marketplace":
      return <MarketplaceLogo size={size} className={className} />;
    case "modivcare":
      return <BrokerLogo size={size} className={className} name="MC" color="#1a73e8" />;
    case "mtm":
      return <BrokerLogo size={size} className={className} name="MTM" color="#e91e63" />;
    case "saferide":
      return <BrokerLogo size={size} className={className} name="SR" color="#4caf50" />;
    case "alivi":
      return <BrokerLogo size={size} className={className} name="AL" color="#ff9800" />;
  }
}

function MediRoutesLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="#1e40af" />
      <path d="M10 28V14l5 8 5-8v14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 28V14h4c2.2 0 3.5 1.3 3.5 3.5S30.2 21 28 21H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="31" cy="14" r="2" fill="#17CB6C" />
    </svg>
  );
}

function UberLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="#000000" />
      <text x="20" y="25" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="14">Uber</text>
    </svg>
  );
}

function LyftLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="#FF00BF" />
      <text x="20" y="25" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="13">Lyft</text>
    </svg>
  );
}

function MarketplaceLogo({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill="#17CB6C" />
      <path d="M12 16h16v2H12zM14 18v8h4v-5h4v5h4v-8" fill="white" />
      <path d="M11 16l9-5 9 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrokerLogo({ size, className, name, color }: { size: number; className: string; name: string; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="40" height="40" rx="8" fill={color} />
      <text x="20" y="25" textAnchor="middle" fill="white" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize={name.length > 2 ? "10" : "14"}>{name}</text>
    </svg>
  );
}
