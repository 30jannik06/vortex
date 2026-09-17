import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Nav } from "@/components/nav"
import { StatusBar } from "@/components/status-bar"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Vortex",
  description: "Homelab Control Center",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={cn(
        "h-full antialiased",
        spaceGrotesk.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          <Nav />
          <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-9">
            {children}
          </main>
          <StatusBar />
        </TooltipProvider>
      </body>
    </html>
  )
}
