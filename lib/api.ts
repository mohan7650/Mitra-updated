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

async function getForPet<T>(accessToken: string, petId: string, resource: string): Promise<T> {
  const res = await fetch(`${API_URL}/pets/${petId}/${resource}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(res.status, await parseError(res));
  return res.json();
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

export interface PostPetSummary {
  id: string;
  name: string;
  species: string;
  breed: string | null;
}

export interface PostInteraction {
  id: string;
  postId: string;
  petId: string;
  type: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  petId: string;
  caption: string | null;
  createdAt: string;
  pet: PostPetSummary;
  interactions: PostInteraction[];
}

export async function apiGetPostsFeed(accessToken: string): Promise<CommunityPost[]> {
  const res = await fetch(`${API_URL}/posts`, {
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
