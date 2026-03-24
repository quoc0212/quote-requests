import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import { api, QuoteReport, AdminStats } from "../../../services/api";

export type Tab = "quotes" | "stats";

export const SERVICES_LIST = [
  "Development",
  "Web Design",
  "Marketing",
  "SEO",
  "Consulting",
  "Other",
];

export function useAdminDashboard() {
  const { t, i18n } = useTranslation();
  const { token, adminEmail, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("quotes");
  const [quotes, setQuotes] = useState<QuoteReport[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 15,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<QuoteReport | null>(null);

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchQuotes = useCallback(
    async (page = 1) => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await api.adminGetQuotes(token, {
          search: search || undefined,
          service: serviceFilter || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          page,
          limit: pagination.limit,
        });
        setQuotes(res.data);
        setPagination(res.pagination);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    },
    [token, search, serviceFilter, startDate, endDate, pagination.limit],
  );

  const fetchStats = useCallback(async () => {
    if (!token) return;
    setStatsLoading(true);
    try {
      const s = await api.adminGetStats(token);
      setStats(s);
    } catch {
      // ignore
    } finally {
      setStatsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchQuotes(1);
    fetchStats();
  }, [fetchQuotes, fetchStats]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes(1);
  };

  const clearFilters = () => {
    setSearch("");
    setServiceFilter("");
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const toggleLang = () => {
    const langs = ["en", "vi", "fr"];
    const idx = langs.findIndex((l) => i18n.language.startsWith(l));
    i18n.changeLanguage(langs[(idx + 1) % langs.length]);
  };

  const sentCount =
    stats?.by_status.find((s) => s.email_status === "sent")?.count || "0";
  const topService = stats?.by_service[0]?.service || "—";
  const hasActiveFilters = !!(search || serviceFilter || startDate || endDate);

  return {
    t,
    adminEmail,
    logout,
    activeTab,
    setActiveTab,
    quotes,
    stats,
    statsLoading,
    pagination,
    loading,
    selectedQuote,
    setSelectedQuote,
    search,
    setSearch,
    serviceFilter,
    setServiceFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchQuotes,
    handleSearch,
    clearFilters,
    formatDate,
    toggleLang,
    sentCount,
    topService,
    hasActiveFilters,
  };
}
