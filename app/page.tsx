import { Coffee, Calendar, ShoppingBag, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Blue Space Coffee</h1>
                <p className="text-sm text-muted-foreground">Pengalaman Kopi Premium</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/menu" className="text-foreground hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/reservations" className="text-foreground hover:text-primary transition-colors">
                Reservasi
              </Link>
              <Link href="/admin" className="text-foreground hover:text-primary transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Selamat Datang di Blue Space Coffee
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Nikmati kopi premium dalam suasana yang nyaman. Pesan online untuk makan di tempat, bawa pulang, atau
            layanan antar, dan reservasi meja terbaik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/menu">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Pesan Sekarang
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/reservations">
                <Calendar className="w-5 h-5 mr-2" />
                Reservasi Meja
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Layanan Kami</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Makan di Tempat</CardTitle>
                <CardDescription>Nikmati suasana nyaman kami dengan kopi segar dan makanan lezat</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/menu?type=dine_in">Pesan Makan di Tempat</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Bawa Pulang</CardTitle>
                <CardDescription>Ambil cepat dan praktis untuk kopi dan camilan favorit Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/menu?type=takeaway">Pesan Bawa Pulang</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-chart-2" />
                </div>
                <CardTitle>Layanan Antar</CardTitle>
                <CardDescription>Dapatkan kopi segar diantar langsung ke depan pintu Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/menu?type=delivery">Pesan Layanan Antar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-foreground">Mengapa Memilih Blue Space Coffee?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <Coffee className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Kualitas Premium</h4>
                    <p className="text-muted-foreground">Biji kopi panggang lokal dan bahan-bahan segar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Pelayanan Cepat</h4>
                    <p className="text-muted-foreground">Persiapan cepat dan waktu pengantaran yang dapat diandalkan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center mt-1">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Reservasi Mudah</h4>
                    <p className="text-muted-foreground">Pesan meja Anda sebelumnya untuk tempat yang sempurna</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coffee className="w-12 h-12 text-primary-foreground" />
                </div>
                <h4 className="text-2xl font-bold text-foreground mb-4">Pengalaman Blue Space</h4>
                <p className="text-muted-foreground mb-6">
                  Dari racikan khas kami hingga suasana yang nyaman, setiap detail dirancang untuk momen kopi sempurna
                  Anda.
                </p>
                <Button asChild>
                  <Link href="/menu">Jelajahi Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 text-foreground">Kunjungi Kami</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Lokasi</h4>
              <p className="text-muted-foreground">
                Jl. Coffee Street No. 123
                <br />
                Jakarta, Indonesia
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Jam Buka</h4>
              <p className="text-muted-foreground">
                Senin - Minggu
                <br />
                07:00 - 22:00
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-2">Kontak</h4>
              <p className="text-muted-foreground">
                +62 21 1234 5678
                <br />
                info@bluespacecoffee.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">Blue Space Coffee</span>
          </div>
          <p className="text-primary-foreground/80">© 2025 Blue Space Coffee. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
