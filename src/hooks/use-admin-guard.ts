import { UNAUTHORIZED } from "@/constants";
import { useNavigation } from "@/utiils";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

const useAdminGuard = () => {
  const { data: session, status } = useSession();
  const { navigateTo } = useNavigation();
  const checked = useRef(false);

  useEffect(() => {
    if (status === "loading" || checked.current) return;
    checked.current = true;

    const role = String(session?.user?.role ?? "").toLowerCase();
    if (!session || role !== "admin") {
      navigateTo(UNAUTHORIZED);
    }
  }, [status, session]);
};

export { useAdminGuard };
