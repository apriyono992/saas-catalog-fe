import { Mail, Phone, Camera, Globe, MessageCircle, Music2 } from 'lucide-react'
import { ErrorState } from '@/components/common/error-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useStoreProfileQuery } from '@/features/store/shared/api/store-profile.queries'

export default function AboutPage() {
  const profileQuery = useStoreProfileQuery()

  if (profileQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ErrorState onRetry={() => profileQuery.refetch()} />
      </div>
    )
  }

  const store = profileQuery.data
  const whatsappHref = store.socialWhatsapp ? `https://wa.me/${store.socialWhatsapp.replace(/\D/g, '')}` : null

  const socials = [
    { label: 'Instagram', href: store.socialInstagram, icon: Camera },
    { label: 'Facebook', href: store.socialFacebook, icon: Globe },
    { label: 'TikTok', href: store.socialTiktok, icon: Music2 },
    { label: 'WhatsApp', href: whatsappHref, icon: MessageCircle },
  ].filter((social): social is typeof social & { href: string } => !!social.href)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About {store.name}</h1>
      {store.description && <p className="mt-4 text-muted-foreground">{store.description}</p>}

      <Card className="mt-8">
        <CardContent className="space-y-3 pt-6">
          {store.contactEmail && (
            <a href={`mailto:${store.contactEmail}`} className="flex items-center gap-2 text-sm hover:underline">
              <Mail className="size-4 text-muted-foreground" />
              {store.contactEmail}
            </a>
          )}
          {store.contactPhone && (
            <a href={`tel:${store.contactPhone}`} className="flex items-center gap-2 text-sm hover:underline">
              <Phone className="size-4 text-muted-foreground" />
              {store.contactPhone}
            </a>
          )}
          {socials.length > 0 && (
            <div className="flex gap-3 pt-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
