"use client";

import { useMemo, useState } from "react";
import type { StoreRecord, StoreStatus } from "@/lib/stores";
import { STORE_STATUS_OPTIONS } from "@/lib/stores";

type Props = {
  initialStores: StoreRecord[];
};

const emptyStore = {
  name: "",
  industry: "",
  ownerEmail: "",
  ownerName: "",
  region: "Bangladesh"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "new-store";
}

export default function StoreManagementClient({ initialStores }: Props) {
  const [stores, setStores] = useState<StoreRecord[]>(initialStores);
  const [form, setForm] = useState(emptyStore);
  const [selectedSlug, setSelectedSlug] = useState(initialStores[0]?.slug || "");

  const selectedStore = stores.find((store) => store.slug === selectedSlug) || stores[0];

  const metrics = useMemo(() => {
    const totalStores = stores.length;
    const activeStores = stores.filter((store) => store.status === "ACTIVE").length;
    const totalOrders = stores.reduce((sum, store) => sum + store.orders, 0);
    const averageHealth = Math.round(stores.reduce((sum, store) => sum + store.health, 0) / Math.max(totalStores, 1));
    return { totalStores, activeStores, totalOrders, averageHealth };
  }, [stores]);

  function updateStatus(slug: string, status: StoreStatus) {
    setStores((current) =>
      current.map((store) =>
        store.slug === slug
          ? {
              ...store,
              status,
              updatedAt: new Date().toISOString().slice(0, 10),
              audit: [`Status changed to ${status}`, ...store.audit].slice(0, 6)
            }
          : store
      )
    );
  }

  function assignOwner(slug: string) {
    const email = window.prompt("Owner email:", "owner@example.com");
    if (!email) return;
    const name = window.prompt("Owner name:", "New Owner") || "New Owner";
    setStores((current) =>
      current.map((store) =>
        store.slug === slug
          ? {
              ...store,
              owner: { name, email, role: "OWNER" },
              updatedAt: new Date().toISOString().slice(0, 10),
              audit: [`Owner assigned to ${email}`, ...store.audit].slice(0, 6)
            }
          : store
      )
    );
  }

  function createStore() {
    if (!form.name.trim()) return;
    const slug = slugify(form.name);
    const newStore: StoreRecord = {
      id: `store_${Date.now()}`,
      slug,
      name: form.name.trim(),
      industry: form.industry.trim() || "General Commerce",
      status: "DRAFT",
      plan: "FREE",
      owner: {
        name: form.ownerName.trim() || "Unassigned Owner",
        email: form.ownerEmail.trim() || "owner@example.com",
        role: "OWNER"
      },
      region: form.region.trim() || "Bangladesh",
      revenue: "$0",
      orders: 0,
      health: 82,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      features: ["Store Builder", "Admin Panel", "Theme Draft"],
      audit: ["Store draft created", "Owner assigned", "Ready for setup"]
    };
    setStores((current) => [newStore, ...current]);
    setSelectedSlug(slug);
    setForm(emptyStore);
  }

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <section className="grid">
        <div className="card"><p className="muted">Total Stores</p><h2>{metrics.totalStores}</h2><p className="muted">All managed stores</p></div>
        <div className="card"><p className="muted">Active Stores</p><h2>{metrics.activeStores}</h2><p className="muted">Live or ready</p></div>
        <div className="card"><p className="muted">Total Orders</p><h2>{metrics.totalOrders}</h2><p className="muted">Sample operational count</p></div>
        <div className="card"><p className="muted">Avg Health</p><h2>{metrics.averageHealth}%</h2><p className="muted">Store reliability score</p></div>
      </section>

      <section className="card">
        <div className="topbar" style={{ marginBottom: 14 }}>
          <div>
            <span className="badge">Create Store</span>
            <h2>Store onboarding</h2>
            <p className="muted">Create a new store draft with owner assignment and audit trail.</p>
          </div>
          <button className="btn primary" onClick={createStore}>Create Store</button>
        </div>
        <div className="grid">
          <input className="input" placeholder="Store name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="input" placeholder="Industry" value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} />
          <input className="input" placeholder="Owner name" value={form.ownerName} onChange={(event) => setForm({ ...form, ownerName: event.target.value })} />
          <input className="input" placeholder="Owner email" value={form.ownerEmail} onChange={(event) => setForm({ ...form, ownerEmail: event.target.value })} />
        </div>
      </section>

      <section className="card">
        <h2>Store registry</h2>
        <table className="table">
          <thead><tr><th>Store</th><th>Owner</th><th>Status</th><th>Plan</th><th>Health</th><th>Actions</th></tr></thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td><strong>{store.name}</strong><br /><span className="muted">/{store.slug}</span></td>
                <td>{store.owner.name}<br /><span className="muted">{store.owner.email}</span></td>
                <td><span className="badge">{store.status}</span></td>
                <td>{store.plan}</td>
                <td>{store.health}%</td>
                <td>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn" onClick={() => setSelectedSlug(store.slug)}>Inspect</button>
                    <button className="btn" onClick={() => assignOwner(store.slug)}>Assign Owner</button>
                    <select className="input" style={{ width: 140 }} value={store.status} onChange={(event) => updateStatus(store.slug, event.target.value as StoreStatus)}>
                      {STORE_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedStore ? (
        <section className="card">
          <div className="topbar" style={{ marginBottom: 8 }}>
            <div>
              <span className="badge">Store Profile</span>
              <h2>{selectedStore.name}</h2>
              <p className="muted">{selectedStore.industry} · {selectedStore.region} · Updated {selectedStore.updatedAt}</p>
            </div>
            <span className="badge">{selectedStore.status}</span>
          </div>
          <div className="grid">
            <div><p className="muted">Revenue</p><h2>{selectedStore.revenue}</h2></div>
            <div><p className="muted">Orders</p><h2>{selectedStore.orders}</h2></div>
            <div><p className="muted">Owner</p><h2>{selectedStore.owner.name}</h2><p className="muted">{selectedStore.owner.email}</p></div>
          </div>
          <div style={{ marginTop: 18 }}>
            <h3>Enabled features</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{selectedStore.features.map((feature) => <span className="badge" key={feature}>{feature}</span>)}</div>
          </div>
          <div style={{ marginTop: 18 }}>
            <h3>Audit trail</h3>
            <ul>{selectedStore.audit.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
