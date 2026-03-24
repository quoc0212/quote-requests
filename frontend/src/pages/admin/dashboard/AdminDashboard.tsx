import React from "react";
import QuoteDetailModal from "../../../components/QuoteDetailModal";
import { useAdminDashboard, SERVICES_LIST } from "./useAdminDashboard";

const AdminDashboard: React.FC = () => {
  const {
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
  } = useAdminDashboard();

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          Quotify<span>.</span>
        </div>
        <nav className="admin-sidebar__nav">
          <button
            className={`admin-nav-item${activeTab === "quotes" ? " admin-nav-item--active" : ""}`}
            onClick={() => setActiveTab("quotes")}
          >
            {t("admin.quotes")}
          </button>
          <button
            className={`admin-nav-item${activeTab === "stats" ? " admin-nav-item--active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            {t("admin.stats")}
          </button>
          <button className="admin-nav-item" onClick={toggleLang}>
            {t("language")}
          </button>
        </nav>
        <div className="admin-sidebar__bottom">
          <button className="admin-nav-item" onClick={logout}>
            {t("admin.logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-topbar__title">{t("admin.title")}</h1>
          <div className="admin-topbar__user">
            <span>👤 {adminEmail}</span>
          </div>
        </div>

        <div className="admin-content">
          {/* Stats Tab */}
          {activeTab === "stats" &&
            (statsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3rem",
                }}
              >
                <div className="confirmation__spinner" />
              </div>
            ) : stats ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div>
                      <div className="stat-card__label">
                        {t("admin.totalRequests")}
                      </div>
                      <div className="stat-card__value">{stats.total}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div>
                      <div className="stat-card__label">
                        {t("admin.emailsSent")}
                      </div>
                      <div className="stat-card__value">{sentCount}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div>
                      <div className="stat-card__label">
                        {t("admin.topService")}
                      </div>
                      <div
                        className="stat-card__value"
                        style={{ fontSize: "1.25rem" }}
                      >
                        {topService}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services breakdown */}
                <div
                  className="table-card"
                  style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
                >
                  <div
                    className="table-card__title"
                    style={{ marginBottom: "1rem", fontWeight: 700 }}
                  >
                    {t("admin.servicesBreakdown")}
                  </div>
                  {stats.by_service.map((item) => {
                    const pct =
                      stats.total > 0
                        ? Math.round((parseInt(item.count) / stats.total) * 100)
                        : 0;
                    return (
                      <div
                        key={item.service}
                        style={{ marginBottom: "0.875rem" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "0.25rem",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>
                            {item.service}
                          </span>
                          <span style={{ color: "var(--gray-500)" }}>
                            {item.count} ({pct}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: 8,
                            background: "var(--gray-100)",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background: "var(--primary)",
                              borderRadius: 4,
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent activity */}
                <div className="table-card" style={{ padding: "1.5rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: "1rem" }}>
                    {t("admin.last30Days")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "3px",
                      height: 80,
                    }}
                  >
                    {stats.recent_30_days.slice(-30).map((item) => {
                      const max = Math.max(
                        ...stats.recent_30_days.map((d) => parseInt(d.count)),
                      );
                      const h =
                        max > 0
                          ? Math.round((parseInt(item.count) / max) * 80)
                          : 4;
                      return (
                        <div
                          key={item.date}
                          title={`${item.date}: ${item.count}`}
                          style={{
                            flex: 1,
                            height: `${h}px`,
                            background: "var(--primary)",
                            borderRadius: "2px 2px 0 0",
                            cursor: "pointer",
                            opacity: 0.8,
                            minHeight: 4,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data">{t("admin.noStats")}</div>
            ))}

          {/* Quotes Tab */}
          {activeTab === "quotes" && (
            <div className="table-card">
              <div className="table-card__header">
                <span className="table-card__title">
                  {t("admin.quotes")} ({pagination.total})
                </span>
                <form className="filter-bar" onSubmit={handleSearch}>
                  <div className="search-input-wrap">
                    <input
                      type="text"
                      className="search-input"
                      placeholder={t("admin.search")}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <select
                    className="filter-select"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                  >
                    <option value="">{t("admin.allServices")}</option>
                    {SERVICES_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="filter-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder={t("admin.from")}
                    title={t("admin.from")}
                  />
                  <input
                    type="date"
                    className="filter-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder={t("admin.to")}
                    title={t("admin.to")}
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                  >
                    🔍
                  </button>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                      onClick={clearFilters}
                    >
                      ✕
                    </button>
                  )}
                </form>
              </div>

              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "3rem",
                  }}
                >
                  <div className="confirmation__spinner" />
                </div>
              ) : quotes.length === 0 ? (
                <div className="no-data">{t("admin.noData")}</div>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>{t("admin.name")}</th>
                          <th>{t("admin.emailCol")}</th>
                          <th>{t("admin.services")}</th>
                          <th>{t("admin.timeline")}</th>
                          <th>{t("admin.budget")}</th>
                          <th>{t("admin.status")}</th>
                          <th>{t("admin.date")}</th>
                          <th>{t("admin.actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((q) => (
                          <tr key={q.id}>
                            <td style={{ fontWeight: 500 }}>{q.name}</td>
                            <td>{q.email}</td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 4,
                                }}
                              >
                                {q.services.map((s) => (
                                  <span
                                    key={s}
                                    className="service-tag"
                                    style={{
                                      fontSize: "0.75rem",
                                      padding: "0.125rem 0.5rem",
                                    }}
                                  >
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>{q.timeline || "—"}</td>
                            <td>{q.budget || "—"}</td>
                            <td>
                              <span
                                className={`status-badge status-badge--${q.email_status}`}
                                style={{ fontSize: "0.75rem" }}
                              >
                                {q.email_status}
                              </span>
                            </td>
                            <td style={{ whiteSpace: "nowrap" }}>
                              {formatDate(q.created_at)}
                            </td>
                            <td>
                              <button
                                className="btn btn--outline"
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  fontSize: "0.8125rem",
                                }}
                                onClick={() => setSelectedQuote(q)}
                              >
                                {t("admin.view")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <span>
                      {t("admin.showing", {
                        from: (pagination.page - 1) * pagination.limit + 1,
                        to: Math.min(
                          pagination.page * pagination.limit,
                          pagination.total,
                        ),
                        total: pagination.total,
                      })}
                    </span>
                    <div className="pagination__controls">
                      <button
                        className="pagination__btn"
                        disabled={pagination.page <= 1}
                        onClick={() => fetchQuotes(pagination.page - 1)}
                      >
                        ‹
                      </button>
                      {Array.from(
                        { length: Math.min(pagination.total_pages, 7) },
                        (_, i) => {
                          const p = i + 1;
                          return (
                            <button
                              key={p}
                              className={`pagination__btn${pagination.page === p ? " pagination__btn--active" : ""}`}
                              onClick={() => fetchQuotes(p)}
                            >
                              {p}
                            </button>
                          );
                        },
                      )}
                      <button
                        className="pagination__btn"
                        disabled={pagination.page >= pagination.total_pages}
                        onClick={() => fetchQuotes(pagination.page + 1)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
