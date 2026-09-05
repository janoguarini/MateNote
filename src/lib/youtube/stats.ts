export function calculateEngagementRate(
  likeCount: number | null,
  commentCount: number | null,
  viewCount: number | null
): number | null {
  if (!viewCount || viewCount === 0) return null;
  const engagements = (likeCount ?? 0) + (commentCount ?? 0);
  return (engagements / viewCount) * 100;
}

export function calculateViewVelocity(
  viewCount: number | null,
  publishedAt: string | null
): number | null {
  if (!viewCount || !publishedAt) return null;
  const daysSincePublish = (Date.now() - new Date(publishedAt).getTime()) / 86_400_000;
  if (daysSincePublish < 1) return viewCount;
  return viewCount / daysSincePublish;
}
