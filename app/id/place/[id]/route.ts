import { connection, NextResponse } from "next/server";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: Request, { params }: RouteContext) {
  await connection();
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return new Response(null, { status: 404 });

  const supabase = createPublicSupabaseClient();
  const { data: place, error } = await supabase
    .from("places")
    .select("id,slug")
    .eq("id", id)
    .eq("publication_status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) throw new Error("Unable to resolve stable place identity.");
  if (!place) return new Response(null, { status: 404 });

  const eligibleIds = await getEligiblePlaceIds(supabase, [place.id]);
  if (!eligibleIds.has(place.id)) return new Response(null, { status: 404 });

  return NextResponse.redirect(new URL(`/places/${place.slug}`, request.url), 308);
}
