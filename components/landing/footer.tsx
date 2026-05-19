// components/landing/footer.tsx
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Sparkles
} from "lucide-react"

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Press", href: "/press" },
]

const resourcesLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Documentation", href: "/docs" },
  { name: "API Reference", href: "/api-docs" },
  { name: "Community", href: "/community" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "GDPR", href: "/gdpr" },
]

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/jobportal" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/jobportal" },
  { name: "GitHub", icon: Github, href: "https://github.com/jobportal" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/jobportal" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/jobportal" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-background to-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl gradient-text">JobPortal</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              AI-powered hiring platform connecting top talent with great companies.
              Transform your recruitment process with intelligent matching.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourcesLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-4 py-8 border-t border-b">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="h-5 w-5 text-primary" />
            <span>support@jobportal.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="h-5 w-5 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Kathmandu, Nepal</span>
          </div>
        </div>

        {/* Copyright and Credits */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {currentYear} JobPortal. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <span>Developed with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>by</span>
            <motion.a
              href="https://raman1224.github.io/DANGOL_AI/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="font-semibold text-primary hover:underline"
            >
              DANGOL AI
            </motion.a>
          </div>

          <div className="flex gap-4">
            <Link href="/sitemap.xml" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
            <Link href="/accessibility" className="hover:text-primary transition-colors">
              Accessibility
            </Link>
            <Link href="/security" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}