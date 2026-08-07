import { GraphQLClient, gql } from "graphql-request";
import { ENDPOINTS } from "./constants";

export const basepaintClient = new GraphQLClient(ENDPOINTS.graphql);

export const CANVAS_BY_DAY = gql`
  query CanvasByDay($day: Int!) {
    canvas(id: $day) {
      id
      day
      theme
      size
      palette
      pixelsCount
      artistsCount
      mintsCount
      burnsCount
      earnings
    }
  }
`;

export const STROKES_FOR_DAY = gql`
  query StrokesForDay($day: Int!, $limit: Int!, $after: String) {
    strokes(
      where: { canvasId: $day }
      orderBy: "timestamp"
      orderDirection: "asc"
      limit: $limit
      after: $after
    ) {
      items {
        id
        data
        timestamp
        account {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CONTRIBUTIONS_FOR_ACCOUNT = gql`
  query ContributionsForAccount($address: String!, $limit: Int!) {
    contributions(
      where: { accountId: $address }
      orderBy: "canvasId"
      orderDirection: "desc"
      limit: $limit
    ) {
      items {
        id
        canvasId
        pixelsCount
      }
    }
  }
`;

export const BRUSH_FOR_ACCOUNT = gql`
  query BrushForAccount($address: String!) {
    brushs(where: { ownerId: $address }) {
      items {
        ownerId
        strength
        streak
        mintedTimestamp
      }
    }
  }
`;
export type StrokeItem = {
  id: string;
  data: string;
  timestamp: string;
  account: { id: string }; // id is the wallet address
};

export type StrokesForDayResult = {
  strokes: {
    items: StrokeItem[];
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

export async function fetchAllStrokesForDay(day: number, pageSize = 500) {
  const all: StrokeItem[] = [];
  let after: string | null = null;
  for (;;) {
    const result: StrokesForDayResult = await basepaintClient.request(STROKES_FOR_DAY, {
      day,
      limit: pageSize,
      after,
    });
    all.push(...result.strokes.items);
    if (!result.strokes.pageInfo.hasNextPage) break;
    after = result.strokes.pageInfo.endCursor;
  }
  return all;
}