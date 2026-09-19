import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image as ImageIcon, Loader2, Plus, RotateCcw, Trash2, Upload, ShoppingBag, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { resolveAssetUrl } from '@/lib/resolve-asset-url'
import { cn } from '@/lib/utils'
import { appearanceSchema, type AppearanceFormValues } from '../appearance.schema'

const DEFAULT_NAVBAR_COLOR = '#2d3336'
const DEFAULT_BUTTON_COLOR = '#2563eb'
const DEFAULT_BUTTON_TEXT_COLOR = '#ffffff'
const DEFAULT_CATEGORY_TITLE = 'Kategori'
const DEFAULT_CARD_COLOR = '#ffffff'
const DEFAULT_SECTION_COLOR = '#f8f7f4'

const PRESETS = [
  { name: 'Default Warm', navbar: '#2d3336', button: '#2563eb', buttonText: '#ffffff', card: '#ffffff', section: '#f8f7f4' },
  { name: 'Modern Slate', navbar: '#0f172a', button: '#3b82f6', buttonText: '#ffffff', card: '#ffffff', section: '#f1f5f9' },
  { name: 'Forest Emerald', navbar: '#064e3b', button: '#10b981', buttonText: '#ffffff', card: '#ffffff', section: '#f0fdf4' },
  { name: 'Royal Indigo', navbar: '#312e81', button: '#6366f1', buttonText: '#ffffff', card: '#ffffff', section: '#eef2ff' },
  { name: 'Warm Amber', navbar: '#451a03', button: '#f59e0b', buttonText: '#000000', card: '#ffffff', section: '#fffbeb' },
  { name: 'Clean White', navbar: '#ffffff', button: '#18181b', buttonText: '#ffffff', card: '#ffffff', section: '#f4f4f5' },
]

export interface AppearanceFormProps {
  settings: {
    bannerUrl?: string | null
    navbarColor?: string | null
    buttonColor?: string | null
    buttonTextColor?: string | null
    categoryTitle?: string | null
    cardColor?: string | null
    cardSectionColor?: string | null
    defaultStrikePercentage?: string | null
  }
  isSaving: boolean
  onSave: (data: AppearanceFormValues) => void
  onUploadBanner: (file: File) => void
  isUploadingBanner?: boolean
  onDeleteBanner: () => void
  isDeletingBanner?: boolean
}

export function AppearanceForm({
  settings,
  isSaving,
  onSave,
  onUploadBanner,
  isUploadingBanner,
  onDeleteBanner,
  isDeletingBanner,
}: AppearanceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localBannerPreview, setLocalBannerPreview] = useState<string | null>(null)
  const [isDraggingBanner, setIsDraggingBanner] = useState(false)

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceSchema),
    values: {
      navbarColor: settings.navbarColor ?? DEFAULT_NAVBAR_COLOR,
      buttonColor: settings.buttonColor ?? DEFAULT_BUTTON_COLOR,
      buttonTextColor: settings.buttonTextColor ?? DEFAULT_BUTTON_TEXT_COLOR,
      categoryTitle: settings.categoryTitle ?? DEFAULT_CATEGORY_TITLE,
      cardColor: settings.cardColor ?? DEFAULT_CARD_COLOR,
      cardSectionColor: settings.cardSectionColor ?? DEFAULT_SECTION_COLOR,
      defaultStrikePercentage: settings.defaultStrikePercentage ?? '35',
    },
  })

  const watchNavbar = form.watch('navbarColor') || DEFAULT_NAVBAR_COLOR
  const watchButton = form.watch('buttonColor') || DEFAULT_BUTTON_COLOR
  const watchButtonText = form.watch('buttonTextColor') || DEFAULT_BUTTON_TEXT_COLOR
  const watchCategoryTitle = form.watch('categoryTitle') || DEFAULT_CATEGORY_TITLE
  const watchCardColor = form.watch('cardColor') || DEFAULT_CARD_COLOR
  const watchSectionColor = form.watch('cardSectionColor') || DEFAULT_SECTION_COLOR
  const watchStrikePct = Number(form.watch('defaultStrikePercentage') || 35)

  const mockBasePrice = 120000
  const mockStrikePrice = Math.round(mockBasePrice * (1 + watchStrikePct / 100))
  const mockDiscount = Math.round(((mockStrikePrice - mockBasePrice) / mockStrikePrice) * 100)

  const bannerDisplay =
    localBannerPreview ??
    (settings.bannerUrl ? resolveAssetUrl(settings.bannerUrl) : null)

  function handleBannerFile(file: File) {
    const localUrl = URL.createObjectURL(file)
    setLocalBannerPreview(localUrl)
    onUploadBanner(file)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    handleBannerFile(file)
  }

  function handleResetColors() {
    form.setValue('navbarColor', DEFAULT_NAVBAR_COLOR)
    form.setValue('buttonColor', DEFAULT_BUTTON_COLOR)
    form.setValue('buttonTextColor', DEFAULT_BUTTON_TEXT_COLOR)
    form.setValue('categoryTitle', DEFAULT_CATEGORY_TITLE)
    form.setValue('cardColor', DEFAULT_CARD_COLOR)
    form.setValue('cardSectionColor', DEFAULT_SECTION_COLOR)
    form.setValue('defaultStrikePercentage', '35')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Form Settings */}
      <div className="lg:col-span-7 space-y-6">
        {/* Banner Section */}
        <Card>
          <CardHeader>
            <CardTitle>Store Banner</CardTitle>
            <CardDescription>
              Banner utama yang tampil pada hero section toko online.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bannerDisplay ? (
              <div className="relative overflow-hidden rounded-lg border bg-muted aspect-[21/9] max-h-48 group">
                <img
                  src={bannerDisplay}
                  alt="Store banner preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isUploadingBanner}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4 mr-1.5" />
                    Ganti Banner
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isDeletingBanner}
                    onClick={() => {
                      setLocalBannerPreview(null)
                      onDeleteBanner()
                    }}
                  >
                    <Trash2 className="size-4 mr-1.5" />
                    Hapus
                  </Button>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingBanner(true)
                }}
                onDragLeave={() => setIsDraggingBanner(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingBanner(false)
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleBannerFile(file)
                }}
                className={cn(
                  'group flex cursor-pointer flex-col items-center justify-center space-y-2.5 rounded-xl border-2 border-dashed p-8 text-center transition-all select-none',
                  isDraggingBanner
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-border hover:border-primary/60 hover:bg-muted/30',
                  isUploadingBanner && 'pointer-events-none opacity-60'
                )}
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted transition-transform group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary">
                  {isUploadingBanner ? (
                    <Loader2 className="size-6 animate-spin text-primary" />
                  ) : (
                    <div className="relative">
                      <ImageIcon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                      <Plus className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isUploadingBanner ? 'Mengunggah banner…' : 'Klik untuk upload banner'}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Format JPG, PNG, atau WEBP (Maksimal 5MB)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelect}
            />

            {isUploadingBanner && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" />
                Mengunggah banner...
              </p>
            )}
          </CardContent>
        </Card>

        {/* Form Styling & Colors */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Desain & Warna Toko</CardTitle>
                <CardDescription>
                  Kustomisasi teks kategori, warna navbar, tombol, dan card section.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetColors}
                title="Reset warna ke default"
              >
                <RotateCcw className="size-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Color Presets */}
            <div className="mb-6">
              <p className="text-xs font-medium text-muted-foreground mb-2">Preset Tema Cepat</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      form.setValue('navbarColor', preset.navbar)
                      form.setValue('buttonColor', preset.button)
                      form.setValue('buttonTextColor', preset.buttonText)
                      form.setValue('cardColor', preset.card)
                      form.setValue('cardSectionColor', preset.section)
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border border-border bg-background hover:bg-muted transition-colors"
                  >
                    <span
                      className="size-3 rounded-full border"
                      style={{ backgroundColor: preset.navbar }}
                    />
                    <span
                      className="size-3 rounded-full border"
                      style={{ backgroundColor: preset.button }}
                    />
                    <span
                      className="size-3 rounded-full border"
                      style={{ backgroundColor: preset.section }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSave)} noValidate className="space-y-5">
              <FieldGroup>
                {/* Category Section Title */}
                <Field data-invalid={!!form.formState.errors.categoryTitle}>
                  <FieldLabel htmlFor="category-title">Judul Section Kategori</FieldLabel>
                  <Input
                    id="category-title"
                    placeholder="Contoh: Kategori, atau Who are you shopping for today?"
                    {...form.register('categoryTitle')}
                  />
                  <FieldError errors={[form.formState.errors.categoryTitle]} />
                  <FieldDescription>
                    Teks judul section kategori di homepage (default: "Kategori").
                  </FieldDescription>
                </Field>

                {/* Navbar Color */}
                <Field data-invalid={!!form.formState.errors.navbarColor}>
                  <FieldLabel htmlFor="navbar-color">Warna Web Bar (Navbar / Header)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="navbarColor"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="navbar-color-picker"
                          value={field.value || DEFAULT_NAVBAR_COLOR}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="size-9 rounded cursor-pointer border border-input p-0.5 bg-transparent"
                        />
                        <Input
                          id="navbar-color"
                          placeholder="#2d3336"
                          className="font-mono text-sm uppercase max-w-[140px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.navbarColor]} />
                  <FieldDescription>
                    Warna latar belakang header storefront.
                  </FieldDescription>
                </Field>

                {/* Card Background Color */}
                <Field data-invalid={!!form.formState.errors.cardColor}>
                  <FieldLabel htmlFor="card-color">Warna Background Card (Kategori & Produk)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="cardColor"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="card-color-picker"
                          value={field.value || DEFAULT_CARD_COLOR}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="size-9 rounded cursor-pointer border border-input p-0.5 bg-transparent"
                        />
                        <Input
                          id="card-color"
                          placeholder="#ffffff"
                          className="font-mono text-sm uppercase max-w-[140px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.cardColor]} />
                  <FieldDescription>
                    Warna dasar masing-masing card produk dan kategori.
                  </FieldDescription>
                </Field>

                {/* Default Strike Percentage */}
                <Field data-invalid={!!form.formState.errors.defaultStrikePercentage}>
                  <FieldLabel htmlFor="strike-pct">Default Persentase Harga Coret (%)</FieldLabel>
                  <div className="flex items-center gap-2 max-w-[140px]">
                    <Input
                      id="strike-pct"
                      type="number"
                      min={0}
                      max={100}
                      placeholder="35"
                      {...form.register('defaultStrikePercentage')}
                    />
                    <span className="text-sm font-semibold text-muted-foreground">%</span>
                  </div>
                  <FieldError errors={[form.formState.errors.defaultStrikePercentage]} />
                  <FieldDescription>
                    Persentase tambahan harga coret otomatis jika admin tidak mengisi harga coret produk secara manual (default: 35%).
                  </FieldDescription>
                </Field>

                {/* Section Background Color */}
                <Field data-invalid={!!form.formState.errors.cardSectionColor}>
                  <FieldLabel htmlFor="section-color">Warna Div Section Card (Wrapper)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="cardSectionColor"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="section-color-picker"
                          value={field.value || DEFAULT_SECTION_COLOR}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="size-9 rounded cursor-pointer border border-input p-0.5 bg-transparent"
                        />
                        <Input
                          id="section-color"
                          placeholder="#f8f7f4"
                          className="font-mono text-sm uppercase max-w-[140px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.cardSectionColor]} />
                  <FieldDescription>
                    Warna latar div pembungkus deretan card agar lebih menarik dan kontras.
                  </FieldDescription>
                </Field>

                {/* Button Color */}
                <Field data-invalid={!!form.formState.errors.buttonColor}>
                  <FieldLabel htmlFor="button-color">Warna Background Button</FieldLabel>
                  <Controller
                    control={form.control}
                    name="buttonColor"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="button-color-picker"
                          value={field.value || DEFAULT_BUTTON_COLOR}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="size-9 rounded cursor-pointer border border-input p-0.5 bg-transparent"
                        />
                        <Input
                          id="button-color"
                          placeholder="#2563eb"
                          className="font-mono text-sm uppercase max-w-[140px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.buttonColor]} />
                  <FieldDescription>
                    Warna utama tombol aksi (primary buttons) pada katalog.
                  </FieldDescription>
                </Field>

                {/* Button Text Color */}
                <Field data-invalid={!!form.formState.errors.buttonTextColor}>
                  <FieldLabel htmlFor="button-text-color">Warna Huruf Button (Teks)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="buttonTextColor"
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          id="button-text-color-picker"
                          value={field.value || DEFAULT_BUTTON_TEXT_COLOR}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="size-9 rounded cursor-pointer border border-input p-0.5 bg-transparent"
                        />
                        <Input
                          id="button-text-color"
                          placeholder="#ffffff"
                          className="font-mono text-sm uppercase max-w-[140px]"
                          {...field}
                          value={field.value ?? ''}
                        />
                        <div className="flex gap-1.5 ml-1">
                          <button
                            type="button"
                            onClick={() => field.onChange('#ffffff')}
                            className="px-2 py-0.5 text-xs rounded border bg-white text-black font-medium"
                          >
                            Putih
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange('#000000')}
                            className="px-2 py-0.5 text-xs rounded border bg-black text-white font-medium"
                          >
                            Hitam
                          </button>
                        </div>
                      </div>
                    )}
                  />
                  <FieldError errors={[form.formState.errors.buttonTextColor]} />
                  <FieldDescription>
                    Warna teks huruf di dalam tombol aksi.
                  </FieldDescription>
                </Field>
              </FieldGroup>

              <div className="pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Menyimpan…' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 sticky top-6 space-y-4">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span>Live Preview Storefront</span>
              <span className="text-xs font-normal text-muted-foreground">Pratinjau langsung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            {/* Mock Web Bar (Navbar) */}
            <div
              className="px-4 py-3 flex items-center justify-between transition-colors shadow-xs"
              style={{ backgroundColor: watchNavbar }}
            >
              <span className="font-semibold text-sm tracking-tight text-white">
                Toko Saya
              </span>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <span>Beranda</span>
                <span>Katalog</span>
              </div>
            </div>

            {/* Mock Banner */}
            {bannerDisplay ? (
              <div className="relative aspect-[21/9] max-h-36 overflow-hidden mx-3 rounded-lg border">
                <img
                  src={bannerDisplay}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            {/* Mock Category Section (Image 1 style) */}
            <div className="p-3">
              <div
                className="p-4 rounded-2xl border transition-colors shadow-2xs"
                style={{ backgroundColor: watchSectionColor }}
              >
                <p className="text-xs font-bold text-center tracking-tight mb-3 text-foreground">
                  {watchCategoryTitle}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Mock Category Card 1 */}
                  <div
                    className="p-2.5 rounded-xl border flex flex-col items-center text-center shadow-2xs transition-transform hover:scale-102"
                    style={{ backgroundColor: watchCardColor }}
                  >
                    <div className="size-12 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 flex items-center justify-center mb-1.5">
                      <ShoppingBag className="size-5 text-amber-700 dark:text-amber-300" />
                    </div>
                    <p className="text-xs font-bold truncate w-full">Food & Treats</p>
                    <p className="text-[10px] text-muted-foreground">Koleksi Produk</p>
                  </div>
                  {/* Mock Category Card 2 */}
                  <div
                    className="p-2.5 rounded-xl border flex flex-col items-center text-center shadow-2xs transition-transform hover:scale-102"
                    style={{ backgroundColor: watchCardColor }}
                  >
                    <div className="size-12 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 flex items-center justify-center mb-1.5">
                      <Tag className="size-5 text-emerald-700 dark:text-emerald-300" />
                    </div>
                    <p className="text-xs font-bold truncate w-full">Supplies & Toys</p>
                    <p className="text-[10px] text-muted-foreground">Koleksi Produk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Product Section (Image 2 style) */}
            <div className="p-3 pt-0">
              <div
                className="p-4 rounded-2xl border transition-colors shadow-2xs"
                style={{ backgroundColor: watchSectionColor }}
              >
                <p className="text-xs font-bold tracking-tight mb-3 text-foreground">
                  Produk Pilihan
                </p>
                <div
                  className="p-3 rounded-xl border shadow-2xs space-y-2.5"
                  style={{ backgroundColor: watchCardColor }}
                >
                  <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    Foto Produk
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-semibold text-primary uppercase">Best Deal</span>
                      {watchStrikePct > 0 && (
                        <span className="rounded bg-destructive text-destructive-foreground text-[9px] px-1 py-0.2 font-bold">
                          -{mockDiscount}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold truncate">Premium Dog Food Meal</p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-foreground">Rp 120.000</span>
                      {watchStrikePct > 0 && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          Rp {mockStrikePrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full py-1.5 text-xs font-medium rounded-lg transition-transform active:scale-95 shadow-xs"
                    style={{
                      backgroundColor: watchButton,
                      color: watchButtonText,
                    }}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
