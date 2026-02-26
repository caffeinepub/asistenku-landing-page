import React, { useState } from "react";
import {
  ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle,
  TrendingUp, Package, CreditCard, RefreshCw, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePaginatedLayanan,
  useActiveClients,
  useCreateLayanan,
  useTopUpUnits,
  useGetAllTopUps,
} from "../../hooks/useQueries";
import { Layanan, UserProfile } from "../../backend";
import { Principal } from "@dfinity/principal";

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border border-border shadow-sm overflow-hidden">
      <button
        className="w-full text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
            </div>
            {open ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
      </button>
      {open && (
        <CardContent className="pt-0 border-t border-border">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

function LayananList() {
  const [page, setPage] = useState(0);
  const { data: layanan, isLoading, isError, refetch } = usePaginatedLayanan(page);

  return (
    <div className="space-y-3 pt-3">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()} className="text-foreground border-border">
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4" /> Gagal memuat layanan.
        </div>
      ) : !layanan || layanan.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Tidak ada layanan aktif.</p>
      ) : (
        <>
          <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
            {layanan.map((l: Layanan) => (
              <div key={l.id.toString()} className="flex items-center justify-between px-4 py-3 bg-card">
                <div>
                  <p className="text-sm font-medium text-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Client: {l.clientId.toString().slice(0, 12)}... | Harga: Rp {l.hargaPerUnit.toString()}/unit
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={l.status === "aktif" ? "default" : "outline"} className="text-xs">
                    {l.status === "aktif" ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{l.unitBalance.toString()} unit</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="text-foreground border-border disabled:opacity-50"
            >
              ← Sebelumnya
            </Button>
            <span className="text-xs text-muted-foreground">Halaman {page + 1}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!layanan || layanan.length < 10}
              onClick={() => setPage((p) => p + 1)}
              className="text-foreground border-border disabled:opacity-50"
            >
              Berikutnya →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function AktivasiLayananForm() {
  const { data: clients, isLoading: clientsLoading } = useActiveClients();
  const createLayanan = useCreateLayanan();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [namaLayanan, setNamaLayanan] = useState("");
  const [hargaPerUnit, setHargaPerUnit] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedClientId || !namaLayanan || !hargaPerUnit) {
      setErrorMsg("Semua field harus diisi.");
      return;
    }

    try {
      const clientPrincipal = Principal.fromText(selectedClientId);
      await createLayanan.mutateAsync({
        name: namaLayanan,
        clientId: clientPrincipal,
        hargaPerUnit: BigInt(parseInt(hargaPerUnit)),
      });
      setSuccessMsg("Layanan berhasil diaktivasi!");
      setSelectedClientId("");
      setNamaLayanan("");
      setHargaPerUnit("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Gagal mengaktivasi layanan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      <div className="space-y-1">
        <Label>Client</Label>
        {clientsLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Select value={selectedClientId} onValueChange={setSelectedClientId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih client..." />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((c: UserProfile) => (
                <SelectItem key={c.idUser} value={c.idUser}>
                  {c.nama} ({c.idUser})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="nama-layanan">Nama Layanan</Label>
        <Input
          id="nama-layanan"
          placeholder="Contoh: Tenang Premium"
          value={namaLayanan}
          onChange={(e) => setNamaLayanan(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="harga-per-unit">Harga per Unit (Rp)</Label>
        <Input
          id="harga-per-unit"
          type="number"
          min="0"
          placeholder="Contoh: 50000"
          value={hargaPerUnit}
          onChange={(e) => setHargaPerUnit(e.target.value)}
        />
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={createLayanan.isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {createLayanan.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
        ) : (
          <><Plus className="w-4 h-4 mr-2" /> Aktivasi</>
        )}
      </Button>
    </form>
  );
}

function TopUpCard() {
  const { data: clients, isLoading: clientsLoading } = useActiveClients();
  const { data: allLayanan } = usePaginatedLayanan(0);
  const topUpUnits = useTopUpUnits();

  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedLayananId, setSelectedLayananId] = useState("");
  const [units, setUnits] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const clientLayanan = allLayanan?.filter(
    (l) => selectedClientId && l.clientId.toString() === selectedClientId
  ) ?? [];

  const selectedLayanan = allLayanan?.find(
    (l) => l.id.toString() === selectedLayananId
  );

  const totalCost = selectedLayanan && units
    ? Number(selectedLayanan.hargaPerUnit) * parseInt(units)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedClientId || !selectedLayananId || !units) {
      setErrorMsg("Semua field harus diisi.");
      return;
    }

    try {
      const clientPrincipal = Principal.fromText(selectedClientId);
      await topUpUnits.mutateAsync({
        clientId: clientPrincipal,
        layananId: BigInt(selectedLayananId),
        units: BigInt(parseInt(units)),
        paymentAmount: BigInt(totalCost),
      });
      setSuccessMsg(`Top up ${units} unit berhasil!`);
      setUnits("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Gagal melakukan top up.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-3">
      <div className="space-y-1">
        <Label>Client</Label>
        {clientsLoading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Select value={selectedClientId} onValueChange={(v) => { setSelectedClientId(v); setSelectedLayananId(""); }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih client..." />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((c: UserProfile) => (
                <SelectItem key={c.idUser} value={c.idUser}>
                  {c.nama} ({c.idUser})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedClientId && (
        <div className="space-y-1">
          <Label>Layanan</Label>
          <Select value={selectedLayananId} onValueChange={setSelectedLayananId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih layanan..." />
            </SelectTrigger>
            <SelectContent>
              {clientLayanan.length === 0 ? (
                <SelectItem value="none" disabled>Tidak ada layanan untuk client ini</SelectItem>
              ) : (
                clientLayanan.map((l) => (
                  <SelectItem key={l.id.toString()} value={l.id.toString()}>
                    {l.name} (Rp {l.hargaPerUnit.toString()}/unit)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="units">Jumlah Unit</Label>
        <Input
          id="units"
          type="number"
          min="1"
          placeholder="Contoh: 10"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
      </div>

      {totalCost > 0 && (
        <div className="p-3 bg-muted/50 rounded-lg text-sm">
          <span className="text-muted-foreground">Total biaya: </span>
          <span className="font-semibold text-foreground">Rp {totalCost.toLocaleString("id-ID")}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={topUpUnits.isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {topUpUnits.isPending ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
        ) : (
          <><CreditCard className="w-4 h-4 mr-2" /> Top Up Unit</>
        )}
      </Button>
    </form>
  );
}

export default function FinanceDashboard() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">AdminFinance Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Kelola layanan, aktivasi, dan top up unit.</p>
      </div>

      <CollapsibleSection
        title="Layanan Aktif"
        icon={<Package className="w-5 h-5 text-primary" />}
        defaultOpen
      >
        <LayananList />
      </CollapsibleSection>

      <CollapsibleSection
        title="Aktivasi Layanan"
        icon={<Plus className="w-5 h-5 text-primary" />}
      >
        <AktivasiLayananForm />
      </CollapsibleSection>

      <CollapsibleSection
        title="Top Up Unit Layanan"
        icon={<CreditCard className="w-5 h-5 text-primary" />}
      >
        <TopUpCard />
      </CollapsibleSection>
    </div>
  );
}
