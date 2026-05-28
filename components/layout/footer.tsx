// // components/layout/footer.tsx
// "use client"

// import Link from "next/link"
// import { motion } from "framer-motion"
// import { 
//   Twitter, Linkedin, Github, Facebook, Instagram, 
//   Mail, Phone, MapPin, Heart, Globe, Briefcase, 
//   Users, GraduationCap, MessageCircle, BookOpen 
// } from "lucide-react"

// const quickLinks = [
//   { name: "About Us", href: "/about" },
//   { name: "Contact Us", href: "/contact" },
//   { name: "Careers", href: "/careers" },
//   { name: "Blog", href: "/blog" },
//   { name: "Press", href: "/press" },
// ]

// const industries = [
//   { name: "IT & Software", href: "/jobs/it-software" },
//   { name: "Banking & Finance", href: "/jobs/banking" },
//   { name: "Healthcare", href: "/jobs/healthcare" },
//   { name: "Education", href: "/jobs/education" },
//   { name: "Construction", href: "/jobs/construction" },
// ]

// const legal = [
//   { name: "Privacy Policy", href: "/privacy" },
//   { name: "Terms of Service", href: "/terms" },
//   { name: "Cookie Policy", href: "/cookies" },
//   { name: "GDPR", href: "/gdpr" },
//   { name: "Security", href: "/security" },
// ]

// const socialLinks = [
//   { name: "Twitter", icon: Twitter, href: "https://twitter.com/jobde" },
//   { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/jobde" },
//   { name: "GitHub", icon: Github, href: "https://github.com/jobde" },
//   { name: "Facebook", icon: Facebook, href: "https://facebook.com/jobde" },
//   { name: "Instagram", icon: Instagram, href: "https://instagram.com/jobde" },
// ]

// export function Footer() {
//   const currentYear = new Date().getFullYear()

//   return (
//     <footer className="bg-slate-900 dark:bg-slate-950 text-white">
//       {/* Main Footer */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {/* Brand Column */}
//           <div>
//             <Link href="/" className="flex items-center gap-2 mb-6">
//               <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 flex items-center justify-center">
//                 <Briefcase className="h-5 w-5 text-white" />
//               </div>
//               <span className="font-bold text-xl">Jobde</span>
//             </Link>
//             <p className="text-slate-400 mb-4 leading-relaxed">
//               Nepal's leading AI-powered job platform connecting talented professionals with great companies.
//             </p>
//             <div className="flex gap-3">
//               {socialLinks.map((social) => {
//                 const Icon = social.icon
//                 return (
//                   <motion.a
//                     key={social.name}
//                     href={social.href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     whileHover={{ y: -3 }}
//                     className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-r from-blue-600 to-orange-500 transition-all"
//                   >
//                     <Icon className="h-4 w-4" />
//                   </motion.a>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               {quickLinks.map((link) => (
//                 <li key={link.name}>
//                   <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Industries */}
//           <div>
//             <h3 className="font-semibold text-lg mb-4">Industries</h3>
//             <ul className="space-y-2">
//               {industries.map((industry) => (
//                 <li key={industry.name}>
//                   <Link href={industry.href} className="text-slate-400 hover:text-white transition-colors text-sm">
//                     {industry.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact & Legal */}
//           <div>
//             <h3 className="font-semibold text-lg mb-4">Contact</h3>
//             <ul className="space-y-3 mb-6">
//               <li className="flex items-center gap-3 text-slate-400 text-sm">
//                 <MapPin className="h-4 w-4" />
//                 Kathmandu, Nepal
//               </li>
//               <li className="flex items-center gap-3 text-slate-400 text-sm">
//                 <Mail className="h-4 w-4" />
//                 info@jobde.com
//               </li>
//               <li className="flex items-center gap-3 text-slate-400 text-sm">
//                 <Phone className="h-4 w-4" />
//                 +977 1 1234567
//               </li>
//             </ul>
//             <h3 className="font-semibold text-lg mb-4 mt-6">Legal</h3>
//             <ul className="space-y-2">
//               {legal.map((link) => (
//                 <li key={link.name}>
//                   <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
//                     {link.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Sub Footer */}
//       <div className="border-t border-slate-800 py-6">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
//             <p>© {currentYear} Jobde. All rights reserved.</p>
//             <div className="flex items-center gap-2">
//               <span>Developed with</span>
//               <Heart className="h-4 w-4 text-red-500 animate-pulse" />
//               <span>by</span>
//               <motion.a
//                 href="https://raman1224.github.io/DANGOL_AI/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 whileHover={{ scale: 1.05 }}
//                 className="font-semibold text-white hover:text-orange-400 transition-colors"
//               >
//                 DANGOL AI
//               </motion.a>
//             </div>
//             <div className="flex gap-4">
//               <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
//               <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

// components/layout/footer.tsx - COMPLETE
"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Twitter, Linkedin, Github, Facebook, Instagram, 
  Mail, Phone, MapPin, Heart, Globe, Briefcase, 
  Users, GraduationCap, MessageCircle, BookOpen, 
  Send, ArrowRight, Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState } from "react"

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Press", href: "/press" },
  { name: "Partners", href: "/partners" },
]

const resources = [
  { name: "Help Center", href: "/help" },
  { name: "Support", href: "/support" },
  { name: "FAQ", href: "/faq" },
  { name: "Community", href: "/community" },
  { name: "Documentation", href: "/docs" },
  { name: "API Reference", href: "/api-docs" },
]

const legal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "GDPR", href: "/gdpr" },
  { name: "Security", href: "/security" },
  { name: "Accessibility", href: "/accessibility" },
]

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/jobde" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/jobde" },
  { name: "GitHub", icon: Github, href: "https://github.com/jobde" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/jobde" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/jobde" },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)
  const currentYear = new Date().getFullYear()

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    setSubscribing(true)
    setTimeout(() => {
      toast.success("Subscribed! You'll receive job alerts.")
      setEmail("")
      setSubscribing(false)
    }, 1000)
  }

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Sparkles className="h-10 w-10 mx-auto mb-4 text-orange-500" />
            <h3 className="text-2xl font-bold mb-2">Get Job Alerts</h3>
            <p className="text-slate-400 mb-6">Subscribe to get notified about new jobs and career opportunities</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button onClick={handleSubscribe} disabled={subscribing} className="bg-gradient-to-r from-blue-600 to-orange-500 whitespace-nowrap">
                {subscribing ? "Subscribing..." : "Subscribe"}
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Jobde
              </span>
            </Link>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Nepal's leading AI-powered job platform connecting talented professionals with great companies.
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
                    className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-gradient-to-r from-blue-600 to-orange-500 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@jobde.com" className="hover:text-white">info@jobde.com</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+9771234567" className="hover:text-white">+977 1-1234567</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {currentYear} Jobde. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Developed with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by</span>
              <a 
                href="https://raman1224.github.io/DANGOL_AI/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-orange-400 transition-colors"
              >
                DANGOL AI
              </a>
            </div>
            <div className="flex gap-4">
              <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link href="/security" className="hover:text-white transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}