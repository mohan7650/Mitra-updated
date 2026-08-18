"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Syringe, Pill, AlertTriangle, Scale, FileText, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import {
  apiGetPets,
  apiGetVaccinations, apiCreateVaccination, apiUpdateVaccination, apiDeleteVaccination,
  apiGetMedications, apiCreateMedication, apiUpdateMedication, apiDeleteMedication,
  apiGetAllergies, apiCreateAllergy, apiUpdateAllergy, apiDeleteAllergy,
  apiGetWeightRecords, apiCreateWeightRecord, apiDeleteWeightRecord,
  apiGetMedicalRecords, apiCreateMedicalRecord, apiUpdateMedicalRecord, apiDeleteMedicalRecord,
  apiGetGroomingRecords, apiCreateGroomingRecord, apiUpdateGroomingRecord, apiDeleteGroomingRecord,
  ApiError,
  Pet, Vaccination, VaccinationInput,
  Medication, MedicationInput,
  Allergy, AllergyInput,
  WeightRecord, WeightRecordInput,
  MedicalRecord, MedicalRecordInput,
  GroomingRecord, GroomingRecordInput,
} from "@/lib/api";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function toDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().slice(0, 10);
}

export default function ProfileHealthPage() {
  return (
    <ProtectedRoute>
      <ProfileHealthPageContent />
    </ProtectedRoute>
  );
}

interface HealthData {
  pet: Pet;
  vaccinations: Vaccination[];
  medications: Medication[];
  allergies: Allergy[];
  weightRecords: WeightRecord[];
  medicalRecords: MedicalRecord[];
  groomingRecords: GroomingRecord[];
}

function ProfileHealthPageContent() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<HealthData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then(async (pets) => {
        if (cancelled) return;
        if (pets.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        const pet = pets[0];
        const [vaccinations, medications, allergies, weightRecords, medicalRecords, groomingRecords] =
          await Promise.all([
            apiGetVaccinations(accessToken, pet.id),
            apiGetMedications(accessToken, pet.id),
            apiGetAllergies(accessToken, pet.id),
            apiGetWeightRecords(accessToken, pet.id),
            apiGetMedicalRecords(accessToken, pet.id),
            apiGetGroomingRecords(accessToken, pet.id),
          ]);
        if (cancelled) return;
        setData({ pet, vaccinations, medications, allergies, weightRecords, medicalRecords, groomingRecords });
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        if (!(err instanceof ApiError)) console.error(err);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, router]);

  async function refresh() {
    if (!accessToken || !data) return;
    const petId = data.pet.id;
    const [vaccinations, medications, allergies, weightRecords, medicalRecords, groomingRecords] =
      await Promise.all([
        apiGetVaccinations(accessToken, petId),
        apiGetMedications(accessToken, petId),
        apiGetAllergies(accessToken, petId),
        apiGetWeightRecords(accessToken, petId),
        apiGetMedicalRecords(accessToken, petId),
        apiGetGroomingRecords(accessToken, petId),
      ]);
    setData({ pet: data.pet, vaccinations, medications, allergies, weightRecords, medicalRecords, groomingRecords });
  }

  if (status === "loading" || !data || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading health records…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t load your pet&rsquo;s health records right now.</p>
        <Link href="/profile" className="text-sm font-600 text-coral-500">Back to Profile</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center gap-3 px-4 pt-5">
          <Link href="/profile" aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-700 text-bark-700">Health Records</h1>
            <p className="text-xs text-bark-500">{data.pet.name}&rsquo;s vaccinations, medications & more</p>
          </div>
        </header>

        <main className="flex-1 space-y-4 px-4 pb-28 pt-5">
          <VaccinationsSection accessToken={accessToken} petId={data.pet.id} items={data.vaccinations} onChange={refresh} />
          <MedicationsSection accessToken={accessToken} petId={data.pet.id} items={data.medications} onChange={refresh} />
          <AllergiesSection accessToken={accessToken} petId={data.pet.id} items={data.allergies} onChange={refresh} />
          <WeightSection accessToken={accessToken} petId={data.pet.id} items={data.weightRecords} pet={data.pet} onChange={refresh} />
          <MedicalRecordsSection accessToken={accessToken} petId={data.pet.id} items={data.medicalRecords} onChange={refresh} />
          <GroomingSection accessToken={accessToken} petId={data.pet.id} items={data.groomingRecords} onChange={refresh} />
        </main>
      </div>
    </div>
  );
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
      <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">{icon} {title}</h3>
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="mt-3 text-sm text-bark-500">{text}</p>;
}

function RowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {onEdit && (
        <button type="button" onClick={onEdit} aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-full bg-white text-bark-600 shadow-soft">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      <button type="button" onClick={onDelete} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full bg-white text-rose-500 shadow-soft">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2.5 text-sm font-600 text-emerald-600"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

function FormShell({ onSubmit, onCancel, submitting, children }: {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
      {children}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-coral-500 py-2 text-sm font-600 text-white disabled:opacity-60">
          {submitting ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 rounded-lg bg-cream-200 py-2 text-sm font-600 text-bark-600">
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-bark-700 outline-none focus:border-coral-400";
const labelCls = "block text-xs font-600 text-bark-500";

/* ---------------- Vaccinations ---------------- */

function VaccinationsSection({ accessToken, petId, items, onChange }: {
  accessToken: string; petId: string; items: Vaccination[]; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vaccination | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<VaccinationInput>({ name: "", dateGiven: "", nextDueDate: "", provider: "", notes: "" });

  function openAdd() {
    setEditing(null);
    setForm({ name: "", dateGiven: "", nextDueDate: "", provider: "", notes: "" });
    setFormOpen(true);
  }
  function openEdit(v: Vaccination) {
    setEditing(v);
    setForm({
      name: v.name,
      dateGiven: toDateInput(v.dateGiven),
      nextDueDate: toDateInput(v.nextDueDate),
      provider: v.provider ?? "",
      notes: v.notes ?? "",
    });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: VaccinationInput = {
        name: form.name,
        dateGiven: form.dateGiven || undefined,
        nextDueDate: form.nextDueDate || undefined,
        provider: form.provider || undefined,
        notes: form.notes || undefined,
      };
      if (editing) {
        await apiUpdateVaccination(accessToken, editing.id, payload);
      } else {
        await apiCreateVaccination(accessToken, petId, payload);
      }
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this vaccination record?")) return;
    await apiDeleteVaccination(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<Syringe className="h-5 w-5 text-sky-500" />} title="Vaccinations">
      {items.length === 0 ? (
        <EmptyRow text="No vaccinations added yet" />
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((v) => (
            <li key={v.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <div>
                <p className="font-700 text-bark-700">{v.name}</p>
                <p className="text-xs text-bark-500">
                  {v.dateGiven ? `Given ${formatDate(v.dateGiven)}` : ""}
                  {v.nextDueDate ? ` • Due ${formatDate(v.nextDueDate)}` : ""}
                  {v.provider ? ` • ${v.provider}` : ""}
                </p>
                {v.notes && <p className="mt-1 text-xs text-bark-500">{v.notes}</p>}
              </div>
              <RowActions onEdit={() => openEdit(v)} onDelete={() => remove(v.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div>
            <label className={labelCls}>Vaccine name</label>
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Date given</label>
              <input type="date" className={inputCls} value={form.dateGiven ?? ""} onChange={(e) => setForm({ ...form, dateGiven: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Next due date</label>
              <input type="date" className={inputCls} value={form.nextDueDate ?? ""} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Provider</label>
            <input className={inputCls} value={form.provider ?? ""} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={inputCls} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Vaccination" />
      )}
    </SectionCard>
  );
}

/* ---------------- Medications ---------------- */

function MedicationsSection({ accessToken, petId, items, onChange }: {
  accessToken: string; petId: string; items: Medication[]; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<MedicationInput>({ name: "", dosage: "", frequency: "", startDate: "", endDate: "", active: true });

  function openAdd() {
    setEditing(null);
    setForm({ name: "", dosage: "", frequency: "", startDate: "", endDate: "", active: true });
    setFormOpen(true);
  }
  function openEdit(m: Medication) {
    setEditing(m);
    setForm({
      name: m.name,
      dosage: m.dosage ?? "",
      frequency: m.frequency ?? "",
      startDate: toDateInput(m.startDate),
      endDate: toDateInput(m.endDate),
      active: m.active,
    });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: MedicationInput = {
        name: form.name,
        dosage: form.dosage || undefined,
        frequency: form.frequency || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        active: form.active,
      };
      if (editing) {
        await apiUpdateMedication(accessToken, editing.id, payload);
      } else {
        await apiCreateMedication(accessToken, petId, payload);
      }
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this medication?")) return;
    await apiDeleteMedication(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<Pill className="h-5 w-5 text-violet-500" />} title="Medications">
      {items.length === 0 ? (
        <EmptyRow text="No medications added yet" />
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((m) => (
            <li key={m.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <div>
                <p className="font-700 text-bark-700">
                  {m.name}{" "}
                  <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-600 ${m.active ? "bg-emerald-100 text-emerald-600" : "bg-cream-200 text-bark-500"}`}>
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p className="text-xs text-bark-500">
                  {m.dosage ?? ""}{m.dosage && m.frequency ? " • " : ""}{m.frequency ?? ""}
                </p>
                {(m.startDate || m.endDate) && (
                  <p className="text-xs text-bark-500">
                    {m.startDate ? formatDate(m.startDate) : "—"} to {m.endDate ? formatDate(m.endDate) : "ongoing"}
                  </p>
                )}
              </div>
              <RowActions onEdit={() => openEdit(m)} onDelete={() => remove(m.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div>
            <label className={labelCls}>Medication name</label>
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Dosage</label>
              <input className={inputCls} value={form.dosage ?? ""} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Frequency</label>
              <input className={inputCls} value={form.frequency ?? ""} onChange={(e) => setForm({ ...form, frequency: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Start date</label>
              <input type="date" className={inputCls} value={form.startDate ?? ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>End date</label>
              <input type="date" className={inputCls} value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-bark-600">
            <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            Currently active
          </label>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Medication" />
      )}
    </SectionCard>
  );
}

/* ---------------- Allergies ---------------- */

function AllergiesSection({ accessToken, petId, items, onChange }: {
  accessToken: string; petId: string; items: Allergy[]; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Allergy | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AllergyInput>({ name: "", severity: "", notes: "" });

  function openAdd() {
    setEditing(null);
    setForm({ name: "", severity: "", notes: "" });
    setFormOpen(true);
  }
  function openEdit(a: Allergy) {
    setEditing(a);
    setForm({ name: a.name, severity: a.severity ?? "", notes: a.notes ?? "" });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: AllergyInput = { name: form.name, severity: form.severity || undefined, notes: form.notes || undefined };
      if (editing) {
        await apiUpdateAllergy(accessToken, editing.id, payload);
      } else {
        await apiCreateAllergy(accessToken, petId, payload);
      }
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this allergy?")) return;
    await apiDeleteAllergy(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} title="Allergies">
      {items.length === 0 ? (
        <EmptyRow text="No allergies added yet" />
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <div>
                <p className="font-700 text-bark-700">{a.name}{a.severity ? ` • ${a.severity}` : ""}</p>
                {a.notes && <p className="mt-1 text-xs text-bark-500">{a.notes}</p>}
              </div>
              <RowActions onEdit={() => openEdit(a)} onDelete={() => remove(a.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div>
            <label className={labelCls}>Allergy name</label>
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Severity</label>
            <input className={inputCls} value={form.severity ?? ""} onChange={(e) => setForm({ ...form, severity: e.target.value })} placeholder="e.g. Mild, Moderate, Severe" />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={inputCls} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Allergy" />
      )}
    </SectionCard>
  );
}

/* ---------------- Weight ---------------- */

function WeightSection({ accessToken, petId, items, pet, onChange }: {
  accessToken: string; petId: string; items: WeightRecord[]; pet: Pet; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<WeightRecordInput>({ weight: 0, unit: pet.weightUnit ?? "kg", recordedAt: "" });

  const sorted = [...items].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  const latest = sorted[0];

  function openAdd() {
    setForm({ weight: 0, unit: pet.weightUnit ?? "kg", recordedAt: "" });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiCreateWeightRecord(accessToken, petId, {
        weight: form.weight,
        unit: form.unit,
        recordedAt: form.recordedAt || undefined,
      });
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this weight record?")) return;
    await apiDeleteWeightRecord(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<Scale className="h-5 w-5 text-forest-500" />} title="Weight">
      {latest ? (
        <p className="mt-2 text-sm text-bark-600">
          Latest: <span className="font-700 text-bark-700">{latest.weight} {latest.unit}</span> on {formatDate(latest.recordedAt)}
        </p>
      ) : pet.weight != null ? (
        <p className="mt-2 text-sm text-bark-600">
          Latest: <span className="font-700 text-bark-700">{pet.weight} {pet.weightUnit ?? ""}</span> (from profile)
        </p>
      ) : (
        <EmptyRow text="No weight recorded yet" />
      )}

      {sorted.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm">
          {sorted.map((w) => (
            <li key={w.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <span className="text-bark-700">{w.weight} {w.unit} • {formatDate(w.recordedAt)}</span>
              <RowActions onDelete={() => remove(w.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Weight</label>
              <input required type="number" step="0.01" min="0" className={inputCls} value={form.weight || ""} onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })} />
            </div>
            <div>
              <label className={labelCls}>Unit</label>
              <select className={inputCls} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Date recorded</label>
            <input type="date" className={inputCls} value={form.recordedAt ?? ""} onChange={(e) => setForm({ ...form, recordedAt: e.target.value })} />
          </div>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Weight Record" />
      )}
    </SectionCard>
  );
}

/* ---------------- Medical Records ---------------- */

function MedicalRecordsSection({ accessToken, petId, items, onChange }: {
  accessToken: string; petId: string; items: MedicalRecord[]; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<MedicalRecordInput>({ recordType: "", title: "", description: "", recordDate: "", vetName: "" });

  function openAdd() {
    setEditing(null);
    setForm({ recordType: "", title: "", description: "", recordDate: "", vetName: "" });
    setFormOpen(true);
  }
  function openEdit(r: MedicalRecord) {
    setEditing(r);
    setForm({
      recordType: r.recordType,
      title: r.title,
      description: r.description ?? "",
      recordDate: toDateInput(r.recordDate),
      vetName: r.vetName ?? "",
    });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: MedicalRecordInput = {
        recordType: form.recordType,
        title: form.title,
        description: form.description || undefined,
        recordDate: form.recordDate,
        vetName: form.vetName || undefined,
      };
      if (editing) {
        await apiUpdateMedicalRecord(accessToken, editing.id, payload);
      } else {
        await apiCreateMedicalRecord(accessToken, petId, payload);
      }
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this medical record?")) return;
    await apiDeleteMedicalRecord(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<FileText className="h-5 w-5 text-rose-500" />} title="Medical Records">
      {items.length === 0 ? (
        <EmptyRow text="No medical records added yet" />
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <div>
                <p className="font-700 text-bark-700">{r.title}</p>
                <p className="text-xs text-bark-500">{r.recordType} • {formatDate(r.recordDate)}{r.vetName ? ` • ${r.vetName}` : ""}</p>
                {r.description && <p className="mt-1 text-xs text-bark-500">{r.description}</p>}
              </div>
              <RowActions onEdit={() => openEdit(r)} onDelete={() => remove(r.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Record type</label>
              <input required className={inputCls} value={form.recordType} onChange={(e) => setForm({ ...form, recordType: e.target.value })} placeholder="e.g. Checkup, Surgery" />
            </div>
            <div>
              <label className={labelCls}>Record date</label>
              <input required type="date" className={inputCls} value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Vet name</label>
            <input className={inputCls} value={form.vetName ?? ""} onChange={(e) => setForm({ ...form, vetName: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Medical Record" />
      )}
    </SectionCard>
  );
}

/* ---------------- Grooming ---------------- */

function GroomingSection({ accessToken, petId, items, onChange }: {
  accessToken: string; petId: string; items: GroomingRecord[]; onChange: () => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<GroomingRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<GroomingRecordInput>({ serviceType: "", provider: "", date: "", nextDueDate: "", notes: "" });

  function openAdd() {
    setEditing(null);
    setForm({ serviceType: "", provider: "", date: "", nextDueDate: "", notes: "" });
    setFormOpen(true);
  }
  function openEdit(g: GroomingRecord) {
    setEditing(g);
    setForm({
      serviceType: g.serviceType,
      provider: g.provider ?? "",
      date: toDateInput(g.date),
      nextDueDate: toDateInput(g.nextDueDate),
      notes: g.notes ?? "",
    });
    setFormOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: GroomingRecordInput = {
        serviceType: form.serviceType,
        provider: form.provider || undefined,
        date: form.date,
        nextDueDate: form.nextDueDate || undefined,
        notes: form.notes || undefined,
      };
      if (editing) {
        await apiUpdateGroomingRecord(accessToken, editing.id, payload);
      } else {
        await apiCreateGroomingRecord(accessToken, petId, payload);
      }
      setFormOpen(false);
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this grooming record?")) return;
    await apiDeleteGroomingRecord(accessToken, id);
    onChange();
  }

  return (
    <SectionCard icon={<Scissors className="h-5 w-5 text-orange-500" />} title="Grooming">
      {items.length === 0 ? (
        <EmptyRow text="No grooming records added yet" />
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((g) => (
            <li key={g.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 ring-1 ring-cream-200">
              <div>
                <p className="font-700 text-bark-700">{g.serviceType}</p>
                <p className="text-xs text-bark-500">
                  {formatDate(g.date)}{g.provider ? ` • ${g.provider}` : ""}{g.nextDueDate ? ` • Next due ${formatDate(g.nextDueDate)}` : ""}
                </p>
                {g.notes && <p className="mt-1 text-xs text-bark-500">{g.notes}</p>}
              </div>
              <RowActions onEdit={() => openEdit(g)} onDelete={() => remove(g.id)} />
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <FormShell onSubmit={submit} onCancel={() => setFormOpen(false)} submitting={submitting}>
          <div>
            <label className={labelCls}>Service type</label>
            <input required className={inputCls} value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })} placeholder="e.g. Bath, Haircut" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Date</label>
              <input required type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Next due date</label>
              <input type="date" className={inputCls} value={form.nextDueDate ?? ""} onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Provider</label>
            <input className={inputCls} value={form.provider ?? ""} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Notes</label>
            <textarea className={inputCls} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </FormShell>
      ) : (
        <AddButton onClick={openAdd} label="Add Grooming Record" />
      )}
    </SectionCard>
  );
}
