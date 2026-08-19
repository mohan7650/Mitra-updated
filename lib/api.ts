const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

interface TokenResponse {
  user: AuthUser;
  accessToken: string;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response) {
  try {
    const body = await res.json();
    return body?.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function apiRegister(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiLogin(data: {
  email: string;
  password: string;
}): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiRefresh(): Promise<{ accessToken: string } | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiLogout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function apiGetMe(accessToken: string): Promise<AuthUser | null> {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function apiUpdateMe(
  accessToken: string,
  data: { firstName?: string; lastName?: string; phone?: string },
): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  customSpecies: string | null;
  breed: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  weight: number | null;
  weightUnit: string | null;
  size: string | null;
  coatType: string | null;
  coatColor: string | null;
  uniqueMarks: string | null;
  microchipped: boolean | null;
  vaccinated: boolean | null;
  neutered: boolean | null;
  hasAllergies: boolean | null;
  personalityTraits: string[];
  favoriteActivities: string[];
  favoriteTreats: string[];
}

export interface CreatePetInput {
  name: string;
  species: string;
  customSpecies?: string;
  breed?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  weight?: number;
  weightUnit?: string;
  size?: string;
  coatType?: string;
  coatColor?: string;
  uniqueMarks?: string;
  microchipped?: boolean;
  vaccinated?: boolean;
  neutered?: boolean;
  hasAllergies?: boolean;
  personalityTraits?: string[];
  favoriteActivities?: string[];
  favoriteTreats?: string[];
}

export async function apiCreatePet(accessToken: string, data: CreatePetInput): Promise<Pet> {
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export type UpdatePetInput = Partial<CreatePetInput>;

export async function apiUpdatePet(accessToken: string, petId: string, data: UpdatePetInput): Promise<Pet> {
  const res = await fetch(`${API_URL}/pets/${petId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiGetPets(accessToken: string): Promise<Pet[]> {
  const res = await fetch(`${API_URL}/pets`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export interface ProfileOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface ProfilePhoto {
  id: string;
  imageUrl: string;
  isProfile: boolean;
  createdAt: string;
}

export interface ProfileNextVaccination {
  id: string;
  name: string;
  nextDueDate: string | null;
  provider: string | null;
}

export interface ProfileActiveMedication {
  id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ProfileAllergy {
  id: string;
  name: string;
  severity: string | null;
  notes: string | null;
}

export interface ProfileLatestWeight {
  weight: number;
  unit: string | null;
  recordedAt: string | null;
  source: "record" | "pet";
}

export interface ProfileNextCheckup {
  id: string;
  title: string;
  dueAt: string;
}

export interface ProfileEmergencyContact {
  id: string;
  name: string;
  relationship: string | null;
  phone: string;
}

export interface ProfileSafetyProfile {
  id: string;
  microchipNumber: string | null;
  qrCodeId: string | null;
  emergencyNotes: string | null;
}

export interface PetProfile {
  pet: {
    id: string;
    name: string;
    species: string;
    customSpecies: string | null;
    breed: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    bio: string | null;
    weight: number | null;
    weightUnit: string | null;
    size: string | null;
    coatType: string | null;
    coatColor: string | null;
    uniqueMarks: string | null;
    microchipped: boolean | null;
    vaccinated: boolean | null;
    neutered: boolean | null;
    hasAllergies: boolean | null;
    personalityTraits: string[];
    favoriteActivities: string[];
    favoriteTreats: string[];
  };
  owner: ProfileOwner;
  profilePhoto: ProfilePhoto | null;
  health: {
    nextVaccination: ProfileNextVaccination | null;
    activeMedications: ProfileActiveMedication[];
    allergies: ProfileAllergy[];
    latestWeight: ProfileLatestWeight | null;
    nextCheckup: ProfileNextCheckup | null;
  };
  emergencyContacts: ProfileEmergencyContact[];
  safetyProfile: ProfileSafetyProfile | null;
  socialStats: {
    pawMoments: number;
    pawPals: number;
  };
}

export async function apiGetPetProfile(accessToken: string, petId: string): Promise<PetProfile> {
  const res = await fetch(`${API_URL}/pets/${petId}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

// Fetching the safety profile lazily creates it (and its QR code) on the backend
// the first time it's requested, so the returned qrCodeId is always present.
export async function apiGetPetSafetyProfile(
  accessToken: string,
  petId: string,
): Promise<ProfileSafetyProfile> {
  const res = await fetch(`${API_URL}/pets/${petId}/safety-profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiUpdatePetSafetyProfile(
  accessToken: string,
  petId: string,
  data: { microchipNumber?: string; emergencyNotes?: string },
): Promise<ProfileSafetyProfile> {
  const res = await fetch(`${API_URL}/pets/${petId}/safety-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

// Public, no-auth lookup used by the /pet-id/[qrCodeId] page — only ever
// returns safe, non-account fields (see backend PetSafetyService.findByQrCode).
export interface PublicPetSafetyInfo {
  qrCodeId: string;
  petName: string;
  species: string;
  breed: string | null;
  emergencyNotes: string | null;
  profilePhotoUrl: string | null;
}

export async function apiGetPublicPetByQr(qrCodeId: string): Promise<PublicPetSafetyInfo | null> {
  const res = await fetch(`${API_URL}/public/pets/qr/${qrCodeId}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

async function getForPet<T>(accessToken: string, petId: string, resource: string): Promise<T> {
  const res = await fetch(`${API_URL}/pets/${petId}/${resource}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

async function postForPet<T>(accessToken: string, petId: string, resource: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/pets/${petId}/${resource}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

async function patchResource<T>(accessToken: string, resource: string, id: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

async function deleteResource(accessToken: string, resource: string, id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${resource}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
}

export interface Vaccination {
  id: string;
  petId: string;
  name: string;
  dateGiven: string | null;
  nextDueDate: string | null;
  provider: string | null;
  notes: string | null;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  recordType: string;
  title: string;
  description: string | null;
  recordDate: string;
  vetName: string | null;
}

export interface Medication {
  id: string;
  petId: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
}

export interface Allergy {
  id: string;
  petId: string;
  name: string;
  severity: string | null;
  notes: string | null;
}

export interface WeightRecord {
  id: string;
  petId: string;
  weight: number;
  unit: string;
  recordedAt: string;
}

export interface GroomingRecord {
  id: string;
  petId: string;
  serviceType: string;
  provider: string | null;
  date: string;
  nextDueDate: string | null;
  notes: string | null;
}

export interface Reminder {
  id: string;
  userId: string;
  petId: string | null;
  type: string;
  title: string;
  description: string | null;
  dueAt: string;
  completed: boolean;
}

export function apiGetVaccinations(accessToken: string, petId: string): Promise<Vaccination[]> {
  return getForPet(accessToken, petId, "vaccinations");
}

export function apiGetMedicalRecords(accessToken: string, petId: string): Promise<MedicalRecord[]> {
  return getForPet(accessToken, petId, "medical-records");
}

export function apiGetMedications(accessToken: string, petId: string): Promise<Medication[]> {
  return getForPet(accessToken, petId, "medications");
}

export function apiGetAllergies(accessToken: string, petId: string): Promise<Allergy[]> {
  return getForPet(accessToken, petId, "allergies");
}

export function apiGetWeightRecords(accessToken: string, petId: string): Promise<WeightRecord[]> {
  return getForPet(accessToken, petId, "weight-records");
}

export function apiGetGroomingRecords(accessToken: string, petId: string): Promise<GroomingRecord[]> {
  return getForPet(accessToken, petId, "grooming-records");
}

export async function apiGetReminders(accessToken: string): Promise<Reminder[]> {
  const res = await fetch(`${API_URL}/reminders`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

// Vaccinations

export interface VaccinationInput {
  name: string;
  dateGiven?: string;
  nextDueDate?: string;
  provider?: string;
  notes?: string;
}

export function apiCreateVaccination(accessToken: string, petId: string, data: VaccinationInput): Promise<Vaccination> {
  return postForPet(accessToken, petId, "vaccinations", data);
}

export function apiUpdateVaccination(accessToken: string, id: string, data: Partial<VaccinationInput>): Promise<Vaccination> {
  return patchResource(accessToken, "vaccinations", id, data);
}

export function apiDeleteVaccination(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "vaccinations", id);
}

// Medications

export interface MedicationInput {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
}

export function apiCreateMedication(accessToken: string, petId: string, data: MedicationInput): Promise<Medication> {
  return postForPet(accessToken, petId, "medications", data);
}

export function apiUpdateMedication(accessToken: string, id: string, data: Partial<MedicationInput>): Promise<Medication> {
  return patchResource(accessToken, "medications", id, data);
}

export function apiDeleteMedication(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "medications", id);
}

// Allergies

export interface AllergyInput {
  name: string;
  severity?: string;
  notes?: string;
}

export function apiCreateAllergy(accessToken: string, petId: string, data: AllergyInput): Promise<Allergy> {
  return postForPet(accessToken, petId, "allergies", data);
}

export function apiUpdateAllergy(accessToken: string, id: string, data: Partial<AllergyInput>): Promise<Allergy> {
  return patchResource(accessToken, "allergies", id, data);
}

export function apiDeleteAllergy(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "allergies", id);
}

// Weight records — create only; history is immutable, no update endpoint

export interface WeightRecordInput {
  weight: number;
  unit: string;
  recordedAt?: string;
}

export function apiCreateWeightRecord(accessToken: string, petId: string, data: WeightRecordInput): Promise<WeightRecord> {
  return postForPet(accessToken, petId, "weight-records", data);
}

export function apiDeleteWeightRecord(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "weight-records", id);
}

// Medical records

export interface MedicalRecordInput {
  recordType: string;
  title: string;
  description?: string;
  recordDate: string;
  vetName?: string;
}

export function apiCreateMedicalRecord(accessToken: string, petId: string, data: MedicalRecordInput): Promise<MedicalRecord> {
  return postForPet(accessToken, petId, "medical-records", data);
}

export function apiUpdateMedicalRecord(accessToken: string, id: string, data: Partial<MedicalRecordInput>): Promise<MedicalRecord> {
  return patchResource(accessToken, "medical-records", id, data);
}

export function apiDeleteMedicalRecord(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "medical-records", id);
}

// Grooming records

export interface GroomingRecordInput {
  serviceType: string;
  provider?: string;
  date: string;
  nextDueDate?: string;
  notes?: string;
}

export function apiCreateGroomingRecord(accessToken: string, petId: string, data: GroomingRecordInput): Promise<GroomingRecord> {
  return postForPet(accessToken, petId, "grooming-records", data);
}

export function apiUpdateGroomingRecord(accessToken: string, id: string, data: Partial<GroomingRecordInput>): Promise<GroomingRecord> {
  return patchResource(accessToken, "grooming-records", id, data);
}

export function apiDeleteGroomingRecord(accessToken: string, id: string): Promise<void> {
  return deleteResource(accessToken, "grooming-records", id);
}

export interface PostPetSummary {
  id: string;
  name: string;
  species: string;
  customSpecies: string | null;
  breed: string | null;
  profilePhotoUrl: string | null;
}

export interface PostInteraction {
  id: string;
  postId: string;
  petId: string;
  type: string;
  createdAt: string;
}

export interface CommunityPostOriginal {
  id: string;
  caption: string | null;
  createdAt: string;
  pet: PostPetSummary;
}

export interface CommunityPost {
  id: string;
  petId: string;
  caption: string | null;
  createdAt: string;
  pet: PostPetSummary;
  interactions: PostInteraction[];
  pawCount: number;
  pawedByMe: boolean;
  repostCount: number;
  originalPost: CommunityPostOriginal | null;
}

export async function apiGetPostsFeed(accessToken: string, asPetId?: string): Promise<CommunityPost[]> {
  const url = new URL(`${API_URL}/posts`);
  if (asPetId) url.searchParams.set("asPetId", asPetId);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiCreatePetPost(
  accessToken: string,
  petId: string,
  caption?: string,
): Promise<{ id: string; petId: string; caption: string | null; createdAt: string }> {
  const res = await fetch(`${API_URL}/pets/${petId}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ caption }),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiToggleInteraction(
  accessToken: string,
  petId: string,
  postId: string,
  type: "PAW",
): Promise<{ toggled: "added" | "removed"; type: string }> {
  const res = await fetch(`${API_URL}/pets/${petId}/posts/${postId}/interactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiRepostPetPost(
  accessToken: string,
  petId: string,
  postId: string,
): Promise<CommunityPost> {
  const res = await fetch(`${API_URL}/pets/${petId}/posts/${postId}/repost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export interface CommunityPetResult {
  id: string;
  name: string;
  species: string;
  customSpecies: string | null;
  breed: string | null;
  bio: string | null;
  personalityTraits: string[];
  profilePhotoUrl: string | null;
}

export async function apiSearchCommunityPets(
  accessToken: string,
  query: string,
): Promise<CommunityPetResult[]> {
  const res = await fetch(`${API_URL}/community/pets/search?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export async function apiGetCommunityPet(
  accessToken: string,
  petId: string,
): Promise<CommunityPetResult> {
  const res = await fetch(`${API_URL}/community/pets/${petId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}

export interface PetConnection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: string;
  createdAt: string;
}

export async function apiGetPetConnections(accessToken: string, petId: string): Promise<PetConnection[]> {
  return getForPet(accessToken, petId, "connections");
}

export async function apiCreatePetConnection(
  accessToken: string,
  petId: string,
  receiverId: string,
): Promise<PetConnection> {
  return postForPet(accessToken, petId, "connections", { receiverId });
}

export async function apiUpdateConnectionStatus(
  accessToken: string,
  connectionId: string,
  status: "ACCEPTED" | "REJECTED",
): Promise<PetConnection> {
  const res = await fetch(`${API_URL}/connections/${connectionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
}
