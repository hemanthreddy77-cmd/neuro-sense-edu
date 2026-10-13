import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminRedirectPage,
});

function AdminRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/dashboard" });
  }, [navigate]);

  return null;
}
