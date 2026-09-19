import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'

function InstagramIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function FacebookIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function AboutPage() {
  const profileQuery = useStoreProfileQuery()

  if (profileQuery.isPending) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:py-12">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <ErrorState onRetry={() => profileQuery.refetch()} />
      </div>
    )
  }

  const store = profileQuery.data
  const whatsappHref = store.socialWhatsapp
    ? `https://wa.me/${store.socialWhatsapp.replace(/\D/g, '')}`
    : null

  const channels = [
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: 'Koleksi foto & update harian',
      href: store.socialInstagram,
      actionText: 'Kunjungi Instagram',
      icon: InstagramIcon,
      colorClass: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white',
      borderHover: 'hover:border-rose-400/60',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      subtitle: 'Video produk & live review',
      href: store.socialTiktok,
      actionText: 'Follow TikTok',
      icon: TikTokIcon,
      colorClass: 'bg-black text-white dark:bg-zinc-800',
      borderHover: 'hover:border-zinc-400/60',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      subtitle: 'Tanya jawab & fast response',
      href: whatsappHref,
      actionText: 'Chat WhatsApp',
      icon: WhatsAppIcon,
      colorClass: 'bg-emerald-600 text-white',
      borderHover: 'hover:border-emerald-500/60',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      subtitle: 'Komunitas & informasi promo',
      href: store.socialFacebook,
      actionText: 'Kunjungi Facebook',
      icon: FacebookIcon,
      colorClass: 'bg-blue-600 text-white',
      borderHover: 'hover:border-blue-500/60',
    },
  ].filter((channel) => !!channel.href)

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Beranda
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Tentang Toko</span>
      </nav>

      {/* Main Store Profile Section Card */}
      <div className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-10 shadow-2xs transition-colors">
        {/* Banner image if present */}
        {store.bannerUrl && (
          <div className="relative aspect-[21/9] sm:aspect-[24/8] max-h-56 w-full overflow-hidden rounded-2xl border border-border/60 mb-8 shadow-xs">
            <img
              src={resolveAssetUrl(store.bannerUrl)}
              alt={store.name}
              className="size-full object-cover"
            />
          </div>
        )}

        {/* Store Intro */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Store className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Official Store
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                {store.name}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line pt-1">
            {store.description ||
              'Selamat datang di toko resmi kami. Kami berkomitmen untuk menghadirkan produk berkualitas terbaik dengan pelayanan yang terpercaya bagi semua pelanggan.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link to="/catalog">Jelajahi Produk Kami</Link>
            </Button>
            {whatsappHref && (
              <Button asChild variant="outline" size="sm">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="gap-1.5">
                  <WhatsAppIcon className="size-3.5 text-emerald-600" />
                  Hubungi Admin
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Social Media & Official Channels */}
      <div className="store-card-section rounded-3xl border border-border/70 bg-[#f9f7f4] dark:bg-muted/20 p-6 sm:p-10 shadow-2xs transition-colors space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Temukan & Ikuti Kami
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Terhubung melalui akun media sosial dan saluran resmi toko kami.
          </p>
        </div>

        {channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <a
                  key={channel.id}
                  href={channel.href!}
                  target="_blank"
                  rel="noreferrer"
                  className={`store-card group p-5 rounded-2xl border border-border/70 bg-card shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${channel.borderHover} flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${channel.colorClass}`}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                        {channel.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {channel.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="hidden sm:inline">{channel.actionText}</span>
                    <ExternalLink className="size-3.5" />
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="store-card p-6 rounded-2xl border border-border/60 bg-card text-center text-muted-foreground text-sm">
            Saluran media sosial belum ditambahkan oleh toko.
          </div>
        )}

        {/* Contact Info (Email & Phone) */}
        {(store.contactEmail || store.contactPhone) && (
          <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {store.contactEmail && (
              <a
                href={`mailto:${store.contactEmail}`}
                className="store-card p-4 rounded-xl border border-border/60 bg-card flex items-center gap-3 hover:border-primary/50 transition-colors group"
              >
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Email Kami</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {store.contactEmail}
                  </p>
                </div>
              </a>
            )}

            {store.contactPhone && (
              <a
                href={`tel:${store.contactPhone}`}
                className="store-card p-4 rounded-xl border border-border/60 bg-card flex items-center gap-3 hover:border-primary/50 transition-colors group"
              >
                <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase">Telepon / Kontak</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {store.contactPhone}
                  </p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="store-card p-5 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-2">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="size-5" />
          </div>
          <p className="font-bold text-sm text-foreground">100% Produk Berkualitas</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Semua produk yang kami tampilkan dijamin keaslian dan mutunya.
          </p>
        </div>

        <div className="store-card p-5 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-2">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="size-5" />
          </div>
          <p className="font-bold text-sm text-foreground">Pelayanan Ramah & Cepat</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tim kami siap membantu menjawab pertanyaan seputar pesanan Anda.
          </p>
        </div>

        <div className="store-card p-5 rounded-2xl border border-border/70 bg-card shadow-2xs space-y-2">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Truck className="size-5" />
          </div>
          <p className="font-bold text-sm text-foreground">Transaksi & Pengiriman Aman</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Didukung oleh berbagai marketplace terpercaya untuk kemudahan Anda.
          </p>
        </div>
      </div>
    </div>
  )
}
