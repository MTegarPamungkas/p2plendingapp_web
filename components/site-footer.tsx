import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

// Komponen untuk logo dan deskripsi
const FooterBranding = () => (
  <div className="space-y-4">
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">P2P</span>
        </div>
      </div>
      <span className="font-bold">
        SME<span className="text-primary">Lend</span>
      </span>
    </Link>
    <p className="text-sm text-muted-foreground max-w-xs">
      P2P lending platform for SMEs with blockchain-based credit scoring using
      Hyperledger Fabric.
    </p>
  </div>
);

// Komponen untuk ikon sosial media
const SocialMediaLinks = () => {
  const socialLinks = [
    { href: "https://twitter.com/smelend", icon: Twitter, label: "Twitter" },
    {
      href: "https://instagram.com/smelend",
      icon: Instagram,
      label: "Instagram",
    },
    { href: "https://github.com/smelend", icon: Github, label: "GitHub" },
    {
      href: "https://linkedin.com/company/smelend",
      icon: Linkedin,
      label: "LinkedIn",
    },
    { href: "https://facebook.com/smelend", icon: Facebook, label: "Facebook" },
  ];

  return (
    <div className="flex gap-3">
      {socialLinks.map(({ href, icon: Icon, label }) => (
        <Button key={label} variant="ghost" size="icon" asChild>
          <Link href={href} aria-label={`Follow us on ${label}`}>
            <Icon className="h-4 w-4" />
          </Link>
        </Button>
      ))}
    </div>
  );
};

// Komponen untuk daftar link
const FooterLinkSection = ({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) => (
  <div className="space-y-4">
    <h3 className="text-sm font-medium text-foreground">{title}</h3>
    <ul className="space-y-2 text-sm">
      {links.map(({ href, label }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export function SiteFooter() {
  const companyLinks = [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/compliance", label: "Compliance" },
    { href: "/faq", label: "FAQ" },
  ];

  const legalLinks = [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/security", label: "Security" },
  ];

  return (
    <footer className="border-t border-border/40 bg-card text-foreground">
      <div className="container px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <FooterBranding />
            <SocialMediaLinks />
          </div>
          <FooterLinkSection title="Company" links={companyLinks} />
          <FooterLinkSection title="Legal" links={legalLinks} />
        </div>
        <div className="mt-10 border-t border-border/40 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 SMELend. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
