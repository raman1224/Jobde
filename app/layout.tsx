

// // app/layout.tsx
// import type { Metadata } from "next"
// import { Inter, Poppins } from "next/font/google"
// import { ThemeProvider } from "@/components/providers/theme-provider"
// import { AuthProvider } from "@/components/auth/auth-provider"
// import { Toaster } from "@/components/ui/toaster"
// import { QueryProvider } from "@/components/providers/query-provider"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
// const poppins = Poppins({ 
//   weight: ["400", "500", "600", "700", "800"],
//   subsets: ["latin"],
//   variable: "--font-poppins" 
// })

// export const metadata: Metadata = {
//   title: "JobPortal - AI-Powered Hiring Platform",
//   description: "Connect top talent with great companies using AI-powered matching",
//   manifest: "/manifest.json",
//   themeColor: '#000000',
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${inter.variable} ${poppins.variable} font-sans`}>
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//           <AuthProvider>
//             <QueryProvider>
//               {children}
//               <Toaster />
//             </QueryProvider>
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }

// app/layout.tsx - OPTIMIZED
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { QueryProvider } from "@/components/providers/query-provider"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
  preload: true,
})

const poppins = Poppins({ 
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Jobde - AI-Powered Job Portal",
    template: "%s | Jobde"
  },
  description: "Connect top talent with great companies using AI-powered matching. Find your dream job or hire the best candidates in Nepal.",
  keywords: "jobs, hiring, career, recruitment, AI matching, Nepal jobs, job portal",
  authors: [{ name: "Jobde Team" }],
  creator: "Jobde",
  publisher: "Jobde",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Jobde - AI-Powered Hiring Platform",
    description: "Connect top talent with great companies using AI-powered matching",
    type: "website",
    locale: "en_US",
    siteName: "Jobde",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobde - AI-Powered Hiring Platform",
    description: "Connect top talent with great companies using AI-powered matching",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}