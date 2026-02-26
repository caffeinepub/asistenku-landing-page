import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSearchPartners, useCreateDelegation } from '../hooks/useQueries';
import { UserProfile } from '../backend';
import { Principal } from '@dfinity/principal';

interface DelegationFormProps {
  taskId: string;
  onSuccess?: () => void;
}

export default function DelegationForm({ taskId, onSuccess }: DelegationFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<UserProfile | null>(null);
  const [deadline, setDeadline] = useState('');
  const [jamEfektif, setJamEfektif] = useState('');
  const [unitTerpakai, setUnitTerpakai] = useState('');

  const { data: partners, isLoading: isSearching } = useSearchPartners(searchQuery);
  const createDelegation = useCreateDelegation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner || !deadline) return;

    const deadlineMs = new Date(deadline).getTime() * 1_000_000;

    await createDelegation.mutateAsync({
      taskId,
      partnerId: Principal.fromText(selectedPartner.idUser),
      deadline: BigInt(deadlineMs),
      jamEfektifPengerjaan: BigInt(jamEfektif || '0'),
      unitLayananTerpakai: BigInt(unitTerpakai || '0'),
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="partner-search">Cari Partner</Label>
        <Input
          id="partner-search"
          placeholder="Nama atau principal ID partner..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (selectedPartner) setSelectedPartner(null);
          }}
          className="mt-1"
        />
        {isSearching && <p className="text-xs text-gray-400 mt-1">Mencari...</p>}
        {partners && partners.length > 0 && !selectedPartner && (
          <div className="border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto">
            {partners.map((p) => (
              <button
                key={p.idUser}
                type="button"
                onClick={() => { setSelectedPartner(p); setSearchQuery(p.nama); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <span className="font-medium">{p.nama}</span>
                <span className="text-gray-400 ml-2 text-xs">{p.status}</span>
              </button>
            ))}
          </div>
        )}
        {selectedPartner && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-teal-600 font-medium">✓ {selectedPartner.nama}</span>
            <button
              type="button"
              onClick={() => { setSelectedPartner(null); setSearchQuery(''); }}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              Ganti
            </button>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="jam-efektif">Jam Efektif</Label>
          <Input
            id="jam-efektif"
            type="number"
            min="0"
            placeholder="0"
            value={jamEfektif}
            onChange={(e) => setJamEfektif(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="unit-terpakai">Unit Terpakai</Label>
          <Input
            id="unit-terpakai"
            type="number"
            min="0"
            placeholder="0"
            value={unitTerpakai}
            onChange={(e) => setUnitTerpakai(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!selectedPartner || !deadline || createDelegation.isPending}
        className="bg-teal-600 hover:bg-teal-700 text-white"
      >
        {createDelegation.isPending ? 'Mendelegasikan...' : 'Delegasikan Task'}
      </Button>

      {createDelegation.isError && (
        <p className="text-xs text-red-500">Gagal mendelegasikan task. Coba lagi.</p>
      )}
    </form>
  );
}
