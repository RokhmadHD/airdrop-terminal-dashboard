// src/lib/api.ts
'use server';
import { Airdrop, CommentWithReplies, Guide, Comment, Profile, KnowledgeBaseSectionWithGuides, Notification, AirdropFormData, AdminUserView, AdminUserDetail, AnalyticsOverview, RecentActivityData, PostFormData, Post } from "./types";
import { revalidatePath } from "next/cache";
// Pastikan URL ini menunjuk ke backend FastAPI Anda
// Gunakan variabel environment untuk ini di produksi!
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export async function getMe(token: string): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  } catch (error) {
    console.error("Error fetching /me:", error);
    return null;
  }
}

export async function getAirdrops(): Promise<Airdrop[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/airdrops`);

    if (!response.ok) {
      throw new Error("Failed to fetch airdrops");
    }

    const data: Airdrop[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching airdrops:", error);
    // Di aplikasi nyata, Anda mungkin ingin menangani error ini dengan lebih baik
    return []; // Kembalikan array kosong jika terjadi error
  }
}

export async function getAirdropBySlug(slug: string): Promise<Airdrop | null> {
  try {
    // Panggil endpoint backend yang sudah kita buat
    const response = await fetch(`${API_BASE_URL}/airdrops/${slug}`);

    // Jika response 404 Not Found, kembalikan null
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch airdrop: ${response.statusText}`);
    }

    const data: Airdrop = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching airdrop with slug ${slug}:`, error);
    return null;
  }
}

export async function createAirdrop(data: AirdropFormData, token: string): Promise<Airdrop> {
  const response = await fetch(`${API_BASE_URL}/airdrops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create airdrop");
  }
  return response.json();
}

export async function updateAirdrop(slug: string, data: Partial<Airdrop>, token: string): Promise<Airdrop> {
  // Partial<AirdropFormData> berarti kita bisa mengirim sebagian field saja
  const response = await fetch(`${API_BASE_URL}/admin/airdrop/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update airdrop");
  }
  return response.json();
}


export async function getGuides(): Promise<Guide[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/guides`, {
      next: { revalidate: 60 } // Revalidate data setiap 60 detik (ISR)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch guides");
    }

    const data: Guide[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

export async function createPost(data: PostFormData, token: string): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/guides`, { // URL endpoint blog
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create post");
  }
  return response.json();
}

export async function updatePost(slug: string, data: Partial<PostFormData>, token: string): Promise<Post> {
  // ... implementasi mirip updateAirdrop
  const response = await fetch(`${API_BASE_URL}/guides/${slug}`, { // URL endpoint blog
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create post");
  }

  revalidatePath('/dashboard/guides/')
  return response.json();
}


export async function getAdminGuides(token: string): Promise<Guide[]> {
  const response = await fetch(`${API_BASE_URL}/admin/guides`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch guides for admin");
  return response.json();
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/guides/${slug}`, {
      next: { revalidate: 60 } // Revalidate data setiap 60 detik (ISR)
    });

    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch guide: ${response.statusText}`);
    }

    const data: Guide = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching guide with slug ${slug}:`, error);
    return null;
  }
}

export async function getComments(params: { guideId?: number; airdropId?: number }): Promise<CommentWithReplies[]> {
  const { guideId, airdropId } = params;
  let url = `${API_BASE_URL}/comments?`;

  if (guideId) {
    url += `guide_id=${guideId}`;
  } else if (airdropId) {
    url += `airdrop_id=${airdropId}`;
  } else {
    throw new Error("Either guideId or airdropId must be provided");
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
}

export async function postComment(
  data: { content: string; guide_id?: number; airdrop_id?: number; parent_id?: number },
  token: string
): Promise<Comment> { // <-- TAMBAHKAN TIPE RETURN DI SINI
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to post comment");
  }

  // Sekarang TypeScript tahu bahwa response.json() adalah objek Comment
  return response.json();
}

export async function getAdminUserDetail(userId: string, token: string): Promise<AdminUserDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch user details");
    return response.json();
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return null;
  }
}

export async function updateUserRole(userId: string, newRole: 'member' | 'admin', token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role: newRole })
  });

  if (!response.ok) {
    // response.status 204 juga dianggap !ok jika kita tidak cek secara eksplisit
    if (response.status === 204) return; // Sukses

    const errorData = await response.json().catch(() => ({})); // Tangkap jika body kosong
    throw new Error(errorData.detail || "Failed to update user role");
  }
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Status 204 (No Content) adalah response sukses untuk DELETE
  if (response.status !== 204) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch (e) {
      // Abaikan jika body kosong
    }
    throw new Error((errorData as any).detail || "Failed to delete user");
  }
}

export async function getAnalyticsOverview(token: string): Promise<AnalyticsOverview | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}

export async function getRecentActivity(token: string): Promise<RecentActivityData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/analytics/recent-activity`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch recent activity");
    return response.json();
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return null;
  }
}

export async function getPublicProfile(userId: string): Promise<Profile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/view/${userId}`); // Panggil endpoint baru
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}

// Update profil
export async function updateProfile(
  userId: string,
  data: Partial<Profile>,
  token: string
): Promise<Profile> {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update profile");
  }
  return response.json();
}


export async function getKnowledgeBaseData(): Promise<KnowledgeBaseSectionWithGuides[]> {
  try {
    // Panggil endpoint backend yang sudah kita buat
    const response = await fetch(`${API_BASE_URL}/guides/knowledge-base`, {
      next: { revalidate: 300 } // Revalidate setiap 5 menit (300 detik)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Knowledge Base data: ${response.statusText}`);
    }

    const data: KnowledgeBaseSectionWithGuides[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Knowledge Base data:", error);
    // Kembalikan array kosong jika terjadi error agar halaman tidak crash
    return [];
  }
}

export async function followAirdrop(airdropId: number, token: string) {
  await fetch(`${API_BASE_URL}/airdrops/${airdropId}/follow`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function unfollowAirdrop(airdropId: number, token: string) {
  await fetch(`${API_BASE_URL}/airdrops/${airdropId}/follow`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export async function getFollowedAirdrops(token: string): Promise<Airdrop[]> {
  const res = await fetch(`${API_BASE_URL}/airdrops/followed/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch followed airdrops");
  return res.json();
}

export async function getFollowStatus(airdropId: number, token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/airdrops/${airdropId}/follow-status`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return false; // Jika error (misal, 401), anggap saja belum follow
  return res.json();
}

export async function getNotifications(token: string): Promise<Notification[]> {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Kirim token di header
    },
    // Opsi caching bisa disesuaikan, untuk notifikasi lebih baik selalu fetch yang baru
    next: { revalidate: 0 }
  });
  console.log(token)
  if (!response.ok) {
    // Jika token tidak valid atau error lain, throw error
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
}

export async function markNotificationsAsRead(
  payload: { notification_ids: number[] },
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notifications/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Tangkap error jika body JSON kosong
    throw new Error(errorData.detail || 'Failed to mark notifications as read');
  }

  // Untuk response 204 No Content, tidak ada body yang perlu di-parse
  return;
}

export async function getAdminUsers(token: string): Promise<AdminUserView[]> {
  const response = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Failed to fetch users for admin");
  return response.json();
}