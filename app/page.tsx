"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BedDouble,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Database,
  Download,
  FileSpreadsheet,
  Home,
  House,
  ImagePlus,
  LayoutDashboard,
  Mail,
  MapPinned,
  MonitorCog,
  PackageCheck,
  QrCode,
  RefreshCw,
  Route,
  Search,
  Send,
  ShoppingBag,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  Sun,
  TabletSmartphone,
  Trees,
  Upload,
  WandSparkles
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import {
  getRecommendations,
  kiteaCatalog,
  rooms,
  styles,
  type KiteaProduct,
  type RoomType,
  type StyleType
} from "@/data/catalog";

type Stage =
  | "home"
  | "room"
  | "style"
  | "source"
  | "phone"
  | "camera"
  | "demo"
  | "analysis"
  | "result"
  | "products"
  | "pickup"
  | "coupon"
  | "admin";

type ImportMode = "phone" | "camera" | "demo";

const analysisMessages = [
  "Analyse de votre espace...",
  "Détection de la configuration de la pièce...",
  "Recherche des produits KITEA adaptés...",
  "Sélection du mobilier disponible...",
  "Création de votre nouvelle ambiance..."
];

const roomIcons: Record<RoomType, LucideIcon> = {
  Salon: Sofa,
  Chambre: BedDouble,
  Terrasse: Trees,
  Bureau: MonitorCog,
  "Coin repas": Home
};

const styleNotes: Record<StyleType, string> = {
  Moderne: "Lignes nettes, noir, bois clair",
  Scandinave: "Blanc, chêne, textiles doux",
  Naturel: "Fibres, plantes, tons organiques",
  Élégant: "Contrastes, doré, lumière chaude",
  Estival: "Clair, frais, touches solaires",
  Familial: "Confort, rangement, usage quotidien"
};

const demoRooms = ["Salon 20 m²", "Grand salon", "Chambre adulte", "Chambre enfant", "Terrasse", "Bureau"];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 }).format(price) + " Dhs";

export default function KiteaRoomRemix() {
  const [stage, setStage] = useState<Stage>("home");
  const [lastFlowStage, setLastFlowStage] = useState<Stage>("home");
  const [room, setRoom] = useState<RoomType>("Salon");
  const [style, setStyle] = useState<StyleType>("Estival");
  const [importMode, setImportMode] = useState<ImportMode>("phone");
  const [selectedDemo, setSelectedDemo] = useState(demoRooms[0]);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const [photoStatus, setPhotoStatus] = useState("En attente de la photo client");
  const [photoPreview, setPhotoPreview] = useState("/assets/demo-before.png");
  const [sessionId, setSessionId] = useState("KITEA-SESSION");
  const [baseUrl, setBaseUrl] = useState("https://kitea.local");
  const [phoneQr, setPhoneQr] = useState("");
  const [recoveryQr, setRecoveryQr] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<KiteaProduct | null>(null);

  const recommendations = useMemo(() => getRecommendations(room, style), [room, style]);
  const totalValue = recommendations.reduce((sum, product) => sum + product.price, 0);

  useEffect(() => {
    setSessionId(`KITEA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    const mobileUrl = `${baseUrl}/mobile-upload/${sessionId}`;
    QRCode.toDataURL(mobileUrl, {
      margin: 1,
      width: 280,
      color: { dark: "#101012", light: "#ffffff" }
    }).then(setPhoneQr);
  }, [baseUrl, sessionId]);

  useEffect(() => {
    const payload = JSON.stringify({
      sessionId,
      room,
      style,
      store: "KITEA Géant",
      products: recommendations.map((product) => ({
        ref: product.ref,
        name: product.name,
        url: product.productUrl,
        aisle: product.aisle,
        zone: product.zone
      }))
    });

    QRCode.toDataURL(payload, {
      margin: 1,
      width: 220,
      color: { dark: "#e30613", light: "#ffffff" }
    }).then(setRecoveryQr);
  }, [recommendations, room, sessionId, style]);

  useEffect(() => {
    if (stage !== "analysis") return;

    setAnalysisIndex(0);
    const interval = window.setInterval(() => {
      setAnalysisIndex((current) => Math.min(current + 1, analysisMessages.length - 1));
    }, 1500);

    const finish = window.setTimeout(() => {
      window.clearInterval(interval);
      setStage("result");
    }, 7800);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(finish);
    };
  }, [stage]);

  function moveTo(nextStage: Stage) {
    if (stage !== "admin") setLastFlowStage(stage);
    setStage(nextStage);
  }

  function returnFromAdmin() {
    setStage(lastFlowStage === "admin" ? "home" : lastFlowStage);
  }

  function goBack() {
    const previous: Record<Stage, Stage> = {
      home: "home",
      room: "home",
      style: "room",
      source: "style",
      phone: "source",
      camera: "source",
      demo: "source",
      analysis: importMode,
      result: "source",
      products: "result",
      pickup: "products",
      coupon: "pickup",
      admin: lastFlowStage
    };
    setStage(previous[stage]);
  }

  function selectImportMode(mode: ImportMode) {
    setImportMode(mode);
    setPhotoStatus(mode === "phone" ? "En attente de la photo client" : "Prêt");
    setStage(mode);
  }

  function startAnalysis() {
    setPhotoStatus("Photo reçue avec succès");
    setStage("analysis");
  }

  function handlePhotoInput(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoStatus("Photo reçue avec succès");
  }

  return (
    <main className="min-h-svh bg-[#111318] p-0 text-kitea-ink sm:p-3">
      <section className="landscape-frame relative mx-auto flex min-h-svh w-full overflow-hidden bg-white shadow-2xl lg:aspect-[16/9] lg:max-h-[calc(100svh-24px)] lg:min-h-0 lg:max-w-[1500px]">
        <AppChrome
          stage={stage}
          room={room}
          style={style}
          onBack={goBack}
          onAdmin={() => moveTo("admin")}
          onHome={() => setStage("home")}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(104,199,233,0.22),transparent_28%),linear-gradient(135deg,#fff_0%,#fff_56%,#f6efe6_100%)]" />
        <div className="relative z-10 min-h-svh w-full overflow-y-auto px-4 pb-6 pt-36 sm:px-6 sm:pt-32 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:overflow-hidden lg:px-7 lg:pb-7 lg:pt-24">
          {stage === "home" && <HomeScreen onStart={() => moveTo("room")} />}
          {stage === "room" && <RoomScreen selected={room} onSelect={setRoom} onNext={() => moveTo("style")} />}
          {stage === "style" && <StyleScreen selected={style} onSelect={setStyle} onNext={() => moveTo("source")} />}
          {stage === "source" && <SourceScreen selected={importMode} onSelect={selectImportMode} />}
          {stage === "phone" && (
            <PhoneImportScreen
              qr={phoneQr}
              sessionId={sessionId}
              status={photoStatus}
              onReceive={startAnalysis}
              onFile={handlePhotoInput}
            />
          )}
          {stage === "camera" && (
            <CameraScreen
              status={photoStatus}
              onFile={handlePhotoInput}
              onRetake={() => setPhotoStatus("Cadrez votre pièce de face avec un maximum de lumière.")}
              onValidate={startAnalysis}
            />
          )}
          {stage === "demo" && (
            <DemoScreen selected={selectedDemo} onSelect={setSelectedDemo} onValidate={startAnalysis} />
          )}
          {stage === "analysis" && (
            <AnalysisScreen
              message={analysisMessages[analysisIndex]}
              progress={((analysisIndex + 1) / analysisMessages.length) * 100}
              room={room}
              style={style}
            />
          )}
          {stage === "result" && (
            <ResultScreen
              photoPreview={photoPreview}
              room={room}
              style={style}
              products={recommendations}
              onProducts={() => moveTo("products")}
            />
          )}
          {stage === "products" && (
            <ProductsScreen
              products={recommendations}
              totalValue={totalValue}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              onPickup={() => moveTo("pickup")}
            />
          )}
          {stage === "pickup" && (
            <PickupScreen
              products={recommendations}
              recoveryQr={recoveryQr}
              onCoupon={() => moveTo("coupon")}
            />
          )}
          {stage === "coupon" && <CouponScreen onRestart={() => setStage("home")} />}
          {stage === "admin" && <AdminScreen onClose={returnFromAdmin} />}
        </div>
      </section>
    </main>
  );
}

function AppChrome({
  stage,
  room,
  style,
  onBack,
  onAdmin,
  onHome
}: {
  stage: Stage;
  room: RoomType;
  style: StyleType;
  onBack: () => void;
  onAdmin: () => void;
  onHome: () => void;
}) {
  const flowStages: Stage[] = ["home", "room", "style", "source", "analysis", "result", "products", "pickup", "coupon"];
  const progress = stage === "admin" ? 100 : ((flowStages.indexOf(stage) + 1) / flowStages.length) * 100;

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex min-h-20 flex-wrap items-center gap-2 bg-white/94 px-4 py-3 shadow-sm backdrop-blur sm:gap-4 sm:px-6 lg:h-20 lg:flex-nowrap lg:px-7 lg:py-0">
      <button className="touch-button grid w-12 place-items-center border border-black/10 bg-white sm:w-14" onClick={onBack} aria-label="Retour">
        <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none sm:gap-3" onClick={onHome} aria-label="Accueil KITEA">
        <img src="/assets/kitea-logo.webp" alt="KITEA" className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
        <div className="text-left">
          <p className="text-[11px] font-black uppercase tracking-[0.1em] text-kitea-red sm:text-xs sm:tracking-[0.16em]">KITEA Géant</p>
          <p className="line-clamp-1 text-sm font-black leading-tight sm:text-base">Réaménagez votre pièce</p>
        </div>
      </button>
      <div className="order-3 w-full min-w-0 flex-1 sm:order-none sm:w-auto">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase text-black/55">
          <span>{stage === "admin" ? "Back-office" : `${room} · ${style}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 overflow-hidden bg-black/10">
          <div className="h-full bg-kitea-red transition-all duration-500" style={{ width: `${Math.max(progress, 8)}%` }} />
        </div>
      </div>
      <button
        className="touch-button flex items-center gap-2 border border-black bg-kitea-ink px-4 font-black uppercase text-white sm:px-5"
        onClick={onAdmin}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="hidden sm:inline">Admin</span>
      </button>
    </header>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7">
      <div className="flex flex-col justify-center">
        <div className="mb-5 inline-flex w-fit items-center gap-2 bg-kitea-red px-4 py-2 text-sm font-black uppercase text-white">
          <Sun className="h-4 w-4" />
          Ambiance été
        </div>
        <h1 className="max-w-[720px] text-4xl font-black leading-[0.98] text-kitea-ink sm:text-5xl lg:text-6xl lg:leading-[0.95]">
          Réaménagez votre pièce avec KITEA
        </h1>
        <p className="mt-5 max-w-[620px] text-lg font-bold leading-tight text-black/65 sm:text-xl lg:text-2xl">
          Découvrez comment votre intérieur pourrait être transformé grâce aux produits KITEA.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <button
            className="touch-button flex items-center justify-center gap-4 bg-kitea-red px-7 py-4 text-xl font-black uppercase text-white shadow-red sm:text-2xl lg:px-9"
            onClick={onStart}
          >
            Commencer
            <ArrowRight className="h-7 w-7" />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold uppercase text-black/50">
            <TabletSmartphone className="h-5 w-5" />
            Format tablette paysage 16:9
          </div>
        </div>
      </div>
      <div className="relative min-h-64 overflow-hidden border-8 border-kitea-red sm:min-h-80 lg:min-h-0">
        <img src="/assets/kitea-summer.webp" alt="Campagne été KITEA" className="h-full w-full object-cover" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-white px-4 py-3 shadow-touch sm:right-auto">
          <Sparkles className="h-6 w-6 text-kitea-red" />
          <span className="text-base font-black sm:text-lg">Projet prêt en moins de 15 secondes</span>
        </div>
      </div>
    </section>
  );
}

function RoomScreen({
  selected,
  onSelect,
  onNext
}: {
  selected: RoomType;
  onSelect: (room: RoomType) => void;
  onNext: () => void;
}) {
  return (
    <ChoiceShell
      eyebrow="Étape 1"
      title="Choisissez la pièce à transformer"
      action="Continuer"
      onNext={onNext}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {rooms.map((room) => {
          const Icon = roomIcons[room];
          const isSelected = selected === room;
          return (
            <button
              key={room}
              className={`flex min-h-40 flex-col justify-between border p-5 text-left transition sm:min-h-48 lg:h-64 ${
                isSelected ? "border-kitea-red bg-kitea-red text-white shadow-red" : "border-black/10 bg-white text-kitea-ink shadow-sm"
              }`}
              onClick={() => onSelect(room)}
            >
              <Icon className="h-10 w-10 lg:h-12 lg:w-12" />
              <span className="text-2xl font-black lg:text-3xl">{room}</span>
              <span className={`text-sm font-bold uppercase ${isSelected ? "text-white/80" : "text-black/45"}`}>
                Rayons adaptés
              </span>
            </button>
          );
        })}
      </div>
    </ChoiceShell>
  );
}

function StyleScreen({
  selected,
  onSelect,
  onNext
}: {
  selected: StyleType;
  onSelect: (style: StyleType) => void;
  onNext: () => void;
}) {
  return (
    <ChoiceShell eyebrow="Étape 2" title="Choisissez l'ambiance" action="Valider le style" onNext={onNext}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {styles.map((style) => {
          const isSelected = selected === style;
          return (
            <button
              key={style}
              className={`min-h-40 border p-5 text-left transition lg:min-h-44 ${
                isSelected ? "border-kitea-red bg-kitea-red text-white shadow-red" : "border-black/10 bg-white text-kitea-ink shadow-sm"
              }`}
              onClick={() => onSelect(style)}
            >
              <div className="mb-6 flex items-center justify-between lg:mb-8">
                <WandSparkles className="h-8 w-8 lg:h-9 lg:w-9" />
                {isSelected && <CheckCircle2 className="h-7 w-7" />}
              </div>
              <h2 className="text-2xl font-black lg:text-3xl">{style}</h2>
              <p className={`mt-2 text-base font-bold lg:text-lg ${isSelected ? "text-white/82" : "text-black/55"}`}>{styleNotes[style]}</p>
            </button>
          );
        })}
      </div>
    </ChoiceShell>
  );
}

function SourceScreen({
  selected,
  onSelect
}: {
  selected: ImportMode;
  onSelect: (mode: ImportMode) => void;
}) {
  const options: Array<{ id: ImportMode; title: string; note: string; icon: LucideIcon; recommended?: boolean }> = [
    {
      id: "phone",
      title: "Importer depuis mon téléphone",
      note: "QR Code unique, iPhone et Android, aucune app à installer",
      icon: Smartphone,
      recommended: true
    },
    {
      id: "camera",
      title: "Prendre une photo maintenant",
      note: "Ouverture caméra tablette ou import direct en magasin",
      icon: Camera
    },
    {
      id: "demo",
      title: "Utiliser une pièce de démonstration",
      note: "Parcours rapide pour visiteurs sans photo",
      icon: House
    }
  ];

  return (
    <ChoiceShell eyebrow="Étape 3" title="Ajoutez la photo de la pièce" action={null}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              className={`relative min-h-56 border p-6 text-left transition lg:min-h-80 ${
                isSelected ? "border-kitea-red bg-kitea-red text-white shadow-red" : "border-black/10 bg-white text-kitea-ink shadow-sm"
              }`}
              onClick={() => onSelect(option.id)}
            >
              {option.recommended && (
                <span className="absolute right-5 top-5 bg-white px-3 py-1 text-xs font-black uppercase text-kitea-red">
                  Recommandé
                </span>
              )}
              <Icon className="h-12 w-12 lg:h-14 lg:w-14" />
              <h2 className="mt-10 max-w-[330px] text-2xl font-black leading-tight lg:mt-16 lg:text-3xl">{option.title}</h2>
              <p className={`mt-4 text-base font-bold leading-snug lg:text-lg ${isSelected ? "text-white/82" : "text-black/55"}`}>
                {option.note}
              </p>
              <ChevronRight className="absolute bottom-6 right-6 h-7 w-7 lg:h-9 lg:w-9" />
            </button>
          );
        })}
      </div>
    </ChoiceShell>
  );
}

function PhoneImportScreen({
  qr,
  sessionId,
  status,
  onReceive,
  onFile
}: {
  qr: string;
  sessionId: string;
  status: string;
  onReceive: () => void;
  onFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[0.95fr_1.05fr] lg:gap-7">
      <div className="flex flex-col justify-center">
        <StepLabel icon={QrCode} label="Import par QR Code" />
        <h1 className="mt-5 text-3xl font-black leading-none sm:text-4xl lg:text-5xl">Scannez le QR Code pour envoyer votre photo</h1>
        <p className="mt-5 max-w-[620px] text-lg font-bold leading-snug text-black/60 lg:text-xl">
          Le client ouvre une page mobile, sélectionne ou prend sa photo, puis la tablette se met à jour automatiquement.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="touch-button flex items-center justify-center gap-3 border border-black bg-white px-5 py-4 text-base font-black uppercase sm:text-lg">
            <Upload className="h-6 w-6" />
            Simuler un envoi
            <input className="hidden" type="file" accept="image/*" onChange={onFile} />
          </label>
          <button className="touch-button flex items-center justify-center gap-3 bg-kitea-red px-7 py-4 text-base font-black uppercase text-white sm:text-lg" onClick={onReceive}>
            Continuer
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center border border-black/10 bg-white p-5 shadow-touch sm:p-8">
        <div className="mb-5 text-center">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-kitea-red">{sessionId}</p>
          <h2 className="text-2xl font-black sm:text-3xl">Photo mobile</h2>
        </div>
        <div className="grid h-56 w-56 place-items-center border-8 border-kitea-red bg-white p-3 sm:h-72 sm:w-72">
          {qr ? <img src={qr} alt="QR Code d'import photo" className="h-full w-full" /> : <div className="qr-fallback h-full w-full" />}
        </div>
        <div className="mt-6 flex items-center gap-3 bg-kitea-sand px-5 py-4 text-base font-black sm:text-lg">
          <CheckCircle2 className={`h-6 w-6 ${status.includes("succès") ? "text-kitea-leaf" : "text-black/35"}`} />
          {status}
        </div>
      </div>
    </section>
  );
}

function CameraScreen({
  status,
  onFile,
  onRetake,
  onValidate
}: {
  status: string;
  onFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRetake: () => void;
  onValidate: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
      <div className="relative aspect-[16/10] overflow-hidden bg-black lg:aspect-auto">
        <img src="/assets/demo-before.png" alt="Aperçu caméra tablette" className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-5 border-4 border-white/80 lg:inset-10" />
        <div className="absolute bottom-4 left-4 right-4 bg-white px-4 py-3 text-base font-black sm:text-lg lg:bottom-6 lg:left-6 lg:right-6 lg:px-5 lg:py-4 lg:text-xl">
          Cadrez votre pièce de face avec un maximum de lumière.
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <StepLabel icon={Camera} label="Caméra tablette" />
        <h1 className="mt-5 text-3xl font-black leading-none sm:text-4xl lg:text-5xl">Prenez la photo de la pièce</h1>
        <p className="mt-4 text-lg font-bold text-black/60 lg:text-xl">{status}</p>
        <div className="mt-8 grid gap-4">
          <label className="touch-button flex items-center justify-center gap-3 bg-kitea-red px-6 py-5 text-lg font-black uppercase text-white shadow-red lg:text-xl">
            <Camera className="h-7 w-7" />
            Prendre la photo
            <input className="hidden" type="file" accept="image/*" capture="environment" onChange={onFile} />
          </label>
          <button className="touch-button flex items-center justify-center gap-3 border border-black bg-white px-6 py-5 text-lg font-black uppercase lg:text-xl" onClick={onRetake}>
            <RefreshCw className="h-6 w-6" />
            Refaire la photo
          </button>
          <button className="touch-button flex items-center justify-center gap-3 bg-kitea-ink px-6 py-5 text-lg font-black uppercase text-white lg:text-xl" onClick={onValidate}>
            <CheckCircle2 className="h-6 w-6" />
            Valider
          </button>
        </div>
      </div>
    </section>
  );
}

function DemoScreen({
  selected,
  onSelect,
  onValidate
}: {
  selected: string;
  onSelect: (demo: string) => void;
  onValidate: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7">
      <div className="flex flex-col justify-center">
        <StepLabel icon={House} label="Mode démonstration" />
        <h1 className="mt-5 text-3xl font-black leading-none sm:text-4xl lg:text-5xl">Choisissez une pièce modèle</h1>
        <p className="mt-5 text-lg font-bold text-black/60 lg:text-xl">
          Idéal pour montrer l'expérience immédiatement aux visiteurs qui n'ont pas de photo.
        </p>
        <button
          className="touch-button mt-8 flex w-full items-center justify-center gap-4 bg-kitea-red px-8 py-4 text-lg font-black uppercase text-white shadow-red sm:w-fit lg:text-xl"
          onClick={onValidate}
        >
          Lancer l'analyse IA
          <Sparkles className="h-7 w-7" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {demoRooms.map((demo) => {
          const isSelected = selected === demo;
          return (
            <button
              key={demo}
              className={`border p-5 text-left transition ${
                isSelected ? "border-kitea-red bg-kitea-red text-white shadow-red" : "border-black/10 bg-white shadow-sm"
              }`}
              onClick={() => onSelect(demo)}
            >
              <img src="/assets/demo-before.png" alt="" className="h-24 w-full object-cover" />
              <p className="mt-4 text-xl font-black lg:text-2xl">{demo}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function AnalysisScreen({
  message,
  progress,
  room,
  style
}: {
  message: string;
  progress: number;
  room: RoomType;
  style: StyleType;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] place-items-center lg:h-full lg:min-h-0">
      <div className="w-full max-w-4xl text-center">
        <div className="mx-auto mb-8 grid h-20 w-20 place-items-center bg-kitea-red text-white shadow-red sm:h-24 sm:w-24 lg:h-28 lg:w-28">
          <Sparkles className="h-10 w-10 animate-pulse sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-kitea-red">
          {room} · {style}
        </p>
        <h1 className="mt-4 text-3xl font-black leading-none sm:text-5xl lg:text-6xl">{message}</h1>
        <div className="mx-auto mt-10 h-4 max-w-3xl bg-black/10">
          <div className="h-full bg-kitea-red transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
          <MiniMetric label="Catalogue" value="Produits réels" icon={Database} />
          <MiniMetric label="IA" value="< 15 sec." icon={WandSparkles} />
          <MiniMetric label="Magasin" value="Rayons associés" icon={MapPinned} />
        </div>
      </div>
    </section>
  );
}

function ResultScreen({
  photoPreview,
  room,
  style,
  products,
  onProducts
}: {
  photoPreview: string;
  room: RoomType;
  style: StyleType;
  products: KiteaProduct[];
  onProducts: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-5 lg:h-full lg:min-h-0 lg:grid-rows-[auto_1fr_auto]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <StepLabel icon={ImagePlus} label="Avant / Après" />
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Votre proposition {style.toLowerCase()} pour {room.toLowerCase()}</h1>
        </div>
        <button className="touch-button flex w-full items-center justify-center gap-3 bg-kitea-red px-7 py-4 text-base font-black uppercase text-white sm:w-auto lg:text-lg" onClick={onProducts}>
          Voir les produits
          <ShoppingBag className="h-6 w-6" />
        </button>
      </div>
      <div className="grid min-h-0 grid-cols-1 gap-5 lg:grid-cols-2">
        <BeforeAfterPanel label="Avant" image={photoPreview} />
        <BeforeAfterPanel label="Après" image="/assets/demo-after.png" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-3 border border-black/10 bg-white p-3">
            <img src={product.image} alt="" className="h-14 w-14 object-contain" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{product.name}</p>
              <p className="text-xs font-bold text-black/50">{product.ref}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductsScreen({
  products,
  totalValue,
  selectedProduct,
  onSelectProduct,
  onPickup
}: {
  products: KiteaProduct[];
  totalValue: number;
  selectedProduct: KiteaProduct | null;
  onSelectProduct: (product: KiteaProduct) => void;
  onPickup: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-5 lg:h-full lg:min-h-0 lg:grid-rows-[auto_1fr]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <StepLabel icon={PackageCheck} label="Produits KITEA recommandés" />
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Sélection catalogue uniquement</h1>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="bg-white px-5 py-3 text-left shadow-sm sm:text-right">
            <p className="text-xs font-black uppercase text-black/45">Panier indicatif</p>
            <p className="text-2xl font-black">{formatPrice(totalValue)}</p>
          </div>
          <button className="touch-button flex items-center justify-center gap-3 bg-kitea-red px-7 py-4 text-base font-black uppercase text-white lg:text-lg" onClick={onPickup}>
            Voir en magasin
            <Route className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="grid min-h-0 gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid min-h-0 grid-cols-1 gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-3 xl:overflow-y-auto xl:pr-1 no-scrollbar">
          {products.map((product) => (
            <button
              key={product.id}
              className="flex min-h-56 flex-col border border-black/10 bg-white p-4 text-left shadow-sm transition hover:border-kitea-red lg:min-h-64"
              onClick={() => onSelectProduct(product)}
            >
              <div className="grid h-28 place-items-center bg-kitea-sand">
                <img src={product.image} alt={product.name} className="h-24 w-28 object-contain" />
              </div>
              <div className="mt-4 flex flex-1 flex-col">
                <p className="text-base font-black leading-tight lg:text-lg">{product.name}</p>
                <p className="mt-2 text-xl font-black text-kitea-red lg:text-2xl">{formatPrice(product.price)}</p>
                <div className="mt-auto grid gap-1 text-sm font-bold text-black/55">
                  <span>Réf. {product.ref}</span>
                  <span>{product.availability} · {product.aisle}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <aside className="min-h-80 border border-black/10 bg-white p-5 shadow-touch xl:min-h-0">
          {selectedProduct ? (
            <ProductDetail product={selectedProduct} />
          ) : (
            <div className="flex h-full flex-col justify-center text-center">
              <Search className="mx-auto h-16 w-16 text-kitea-red" />
              <h2 className="mt-5 text-2xl font-black lg:text-3xl">Touchez un produit</h2>
              <p className="mt-3 text-lg font-bold text-black/55">La fiche réelle, la référence et le rayon s'affichent ici.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ProductDetail({ product }: { product: KiteaProduct }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid h-40 place-items-center bg-kitea-sand lg:h-48">
        <img src={product.image} alt={product.name} className="h-36 object-contain lg:h-44" />
      </div>
      <h2 className="mt-5 text-2xl font-black leading-tight lg:text-3xl">{product.name}</h2>
      <p className="mt-3 text-3xl font-black text-kitea-red lg:text-4xl">{formatPrice(product.price)}</p>
      <div className="mt-5 grid gap-3 text-base font-bold lg:text-lg">
        <InfoLine label="Référence" value={product.ref} />
        <InfoLine label="Disponibilité" value={product.availability} />
        <InfoLine label="Rayon" value={`${product.department} · ${product.aisle}`} />
        <InfoLine label="Zone" value={product.zone} />
      </div>
      <a
        href={product.productUrl}
        target="_blank"
        rel="noreferrer"
        className="touch-button mt-6 flex items-center justify-center gap-3 bg-kitea-ink px-5 py-4 text-base font-black uppercase text-white lg:mt-auto lg:text-lg"
      >
        Ouvrir la fiche
        <ArrowRight className="h-6 w-6" />
      </a>
    </div>
  );
}

function PickupScreen({
  products,
  recoveryQr,
  onCoupon
}: {
  products: KiteaProduct[];
  recoveryQr: string;
  onCoupon: () => void;
}) {
  const departments = [...new Set(products.map((product) => product.department))];
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-7">
      <div className="flex flex-col justify-center">
        <StepLabel icon={MapPinned} label="Orientation magasin" />
        <h1 className="mt-5 text-3xl font-black leading-none sm:text-4xl lg:text-5xl">Retrouvez votre sélection dans le magasin</h1>
        <div className="mt-8 grid gap-4">
          {departments.map((department) => {
            const first = products.find((product) => product.department === department)!;
            return (
              <div key={department} className="flex items-center justify-between border border-black/10 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-xl font-black lg:text-2xl">{department}</p>
                  <p className="text-base font-bold text-black/55 lg:text-lg">{first.zone}</p>
                </div>
                <div className="bg-kitea-red px-4 py-3 text-lg font-black text-white lg:px-5 lg:text-xl">{first.aisle}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid gap-5 lg:grid-rows-[1fr_auto]">
        <div className="grid gap-5 border border-black/10 bg-white p-5 shadow-touch sm:grid-cols-[0.8fr_1.2fr] lg:p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="grid h-44 w-44 place-items-center border-8 border-kitea-red bg-white p-2 sm:h-52 sm:w-52">
              {recoveryQr ? <img src={recoveryQr} alt="QR Code de récupération" /> : <div className="qr-fallback h-full w-full" />}
            </div>
            <p className="mt-4 text-center text-sm font-black uppercase text-black/45">Projet, produits, références</p>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black lg:text-4xl">QR Code personnel</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ActionTile icon={Mail} label="Email" />
              <ActionTile icon={Send} label="WhatsApp" />
              <ActionTile icon={QrCode} label="Scanner" />
              <ActionTile icon={Download} label="Exporter" />
            </div>
          </div>
        </div>
        <button
          className="touch-button flex items-center justify-center gap-4 bg-kitea-red px-8 py-5 text-xl font-black uppercase text-white shadow-red lg:text-2xl"
          onClick={onCoupon}
        >
          Je participe
          <ArrowRight className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}

function CouponScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-6 lg:h-full lg:min-h-0 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
      <div className="relative aspect-[16/9] overflow-hidden border-8 border-kitea-red lg:aspect-auto">
        <img src="/assets/kitea-wheel-screen.jpeg" alt="Animation Roue des Coupons KITEA" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <StepLabel icon={Sparkles} label="Animation KITEA" />
        <h1 className="mt-5 text-4xl font-black leading-none sm:text-5xl lg:text-6xl">Votre projet est prêt !</h1>
        <p className="mt-6 max-w-[600px] text-lg font-bold leading-tight text-black/65 sm:text-xl lg:text-2xl">
          Rendez-vous maintenant au stand KITEA pour tenter d'augmenter votre coupon grâce à la Roue des Coupons.
        </p>
        <button
          className="touch-button mt-9 flex w-full items-center justify-center gap-4 bg-kitea-red px-8 py-5 text-xl font-black uppercase text-white shadow-red sm:w-fit lg:text-2xl"
          onClick={onRestart}
        >
          Nouveau projet
          <RefreshCw className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}

function AdminScreen({ onClose }: { onClose: () => void }) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-5 lg:h-full lg:min-h-0 lg:grid-rows-[auto_1fr]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StepLabel icon={LayoutDashboard} label="Back-office admin" />
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Catalogue, magasins, leads et simulations</h1>
        </div>
        <button className="touch-button flex w-full items-center justify-center gap-3 bg-kitea-ink px-7 py-4 text-base font-black uppercase text-white sm:w-fit lg:text-lg" onClick={onClose}>
          Retour expérience
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-4">
          <AdminImport icon={FileSpreadsheet} title="Import catalogue Excel" detail="XLSX, prix, références, images" />
          <AdminImport icon={Upload} title="Import CSV" detail="Produits, stocks, rayons" />
          <AdminImport icon={Database} title="Connexion API catalogue" detail="Synchronisation programmée" />
          <AdminImport icon={Store} title="Gestion magasins" detail="KITEA Géant, allées, zones" />
        </div>
        <div className="grid min-h-0 grid-rows-[auto_1fr] gap-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MiniMetric icon={PackageCheck} label="Produits" value={String(kiteaCatalog.length)} />
            <MiniMetric icon={ClipboardList} label="Simulations" value="184" />
            <MiniMetric icon={BarChart3} label="Temps moyen" value="11 s" />
            <MiniMetric icon={Mail} label="Leads export" value="42" />
          </div>
          <div className="min-h-0 overflow-x-auto border border-black/10 bg-white shadow-touch">
            <div className="grid min-w-[760px] grid-cols-[1.1fr_0.55fr_0.45fr_0.55fr_0.6fr] bg-kitea-ink px-4 py-3 text-sm font-black uppercase text-white">
              <span>Produit</span>
              <span>Référence</span>
              <span>Prix</span>
              <span>Rayon</span>
              <span>Source</span>
            </div>
            <div className="max-h-[430px] min-w-[760px] overflow-y-auto no-scrollbar">
              {kiteaCatalog.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-[1.1fr_0.55fr_0.45fr_0.55fr_0.6fr] items-center border-b border-black/10 px-4 py-3 text-sm font-bold"
                >
                  <span className="truncate">{product.name}</span>
                  <span>{product.ref}</span>
                  <span>{formatPrice(product.price)}</span>
                  <span>{product.aisle}</span>
                  <a className="truncate text-kitea-red" href={product.sourceUrl} target="_blank" rel="noreferrer">
                    KITEA
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceShell({
  eyebrow,
  title,
  action,
  onNext,
  children
}: {
  eyebrow: string;
  title: string;
  action: string | null;
  onNext?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-h-[calc(100svh-9rem)] gap-5 lg:h-full lg:min-h-0 lg:grid-rows-[auto_1fr_auto] lg:gap-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-kitea-red">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black leading-none sm:text-4xl lg:text-5xl">{title}</h1>
      </div>
      <div className="min-h-0">{children}</div>
      {action && onNext ? (
        <div className="flex justify-stretch sm:justify-end">
          <button className="touch-button flex w-full items-center justify-center gap-3 bg-kitea-red px-8 py-4 text-lg font-black uppercase text-white shadow-red sm:w-auto lg:text-xl" onClick={onNext}>
            {action}
            <ArrowRight className="h-7 w-7" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function BeforeAfterPanel({ label, image }: { label: string; image: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-black/10 bg-black lg:aspect-auto">
      <img src={image} alt={`${label} de la pièce`} className="h-full w-full object-cover" />
      <div className="absolute left-3 top-3 bg-white px-3 py-2 text-base font-black uppercase text-kitea-red shadow-sm sm:left-4 sm:top-4 sm:px-4 sm:text-xl">{label}</div>
    </div>
  );
}

function StepLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="inline-flex w-fit items-center gap-2 bg-kitea-red px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-white sm:px-4 sm:text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-white p-4 shadow-sm">
      <Icon className="h-6 w-6 text-kitea-red lg:h-7 lg:w-7" />
      <p className="mt-4 text-xs font-black uppercase text-black/45">{label}</p>
      <p className="text-xl font-black lg:text-2xl">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-2">
      <span className="text-black/45">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function ActionTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <button className="touch-button flex items-center justify-center gap-2 border border-black/10 bg-kitea-sand px-4 py-4 text-sm font-black uppercase sm:text-base">
      <Icon className="h-5 w-5 text-kitea-red" />
      {label}
    </button>
  );
}

function AdminImport({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <label className="flex min-h-24 items-center gap-4 border border-black/10 bg-white p-4 shadow-sm lg:min-h-28 lg:p-5">
      <span className="grid h-14 w-14 shrink-0 place-items-center bg-kitea-red text-white">
        <Icon className="h-7 w-7" />
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-black leading-tight lg:text-2xl">{title}</span>
        <span className="block text-sm font-bold uppercase text-black/45">{detail}</span>
      </span>
      <input className="hidden" type="file" accept=".csv,.xlsx,.xls" />
    </label>
  );
}
