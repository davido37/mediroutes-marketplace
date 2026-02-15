"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTripFlowContext } from "@/hooks/trip-flow-context";
import { TOKEN_MAP, buildTripRequestFromToken } from "@/lib/mock-data";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Button } from "@/components/common/button";
import { delay } from "@/lib/utils";

function NewTripContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dispatch } = useTripFlowContext();
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    async function resolveToken() {
      await delay(600);

      if (!token) {
        setError("No token provided. Please use a valid Salesforce link.");
        setResolving(false);
        return;
      }

      const data = TOKEN_MAP[token];
      if (!data) {
        setError(
          `Invalid or expired token "${token}". Please return to Salesforce and try again.`
        );
        setResolving(false);
        return;
      }

      const tripRequest = buildTripRequestFromToken(token, data);
      dispatch({ type: "SET_TRIP_REQUEST", payload: tripRequest });
      router.push("/facility/confirm");
    }

    resolveToken();
  }, [searchParams, dispatch, router]);

  if (resolving && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-text-secondary">
          Resolving Salesforce record...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="rounded-full h-16 w-16 bg-danger-light flex items-center justify-center">
          <span className="text-danger text-2xl font-bold">!</span>
        </div>
        <h2 className="text-lg font-semibold text-text-primary">
          Unable to Load Trip
        </h2>
        <p className="text-sm text-text-secondary text-center max-w-md">
          {error}
        </p>
        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() =>
              (window.location.href = "/facility/new-trip?token=abc123")
            }
          >
            Try Demo Token
          </Button>
        </div>
        <div className="mt-8 text-xs text-text-muted">
          <p>Available demo tokens:</p>
          <div className="flex gap-2 mt-1">
            {Object.keys(TOKEN_MAP).map((t) => (
              <button
                key={t}
                className="text-brand hover:underline"
                onClick={() =>
                  (window.location.href = `/facility/new-trip?token=${t}`)
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function NewTripPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <NewTripContent />
    </Suspense>
  );
}
