"use client";

import React, { useMemo, useState } from 'react';
import { Db, Lead, LeadStage } from '../lib/types';
import { loadDb, saveDb } from '../lib/storage';
import { computeLeadScore } from '../lib/agent';

export function LeadList({ onChange }: { onChange?: () => void }) {
  const [db, setDb] = useState<Db>(() => loadDb());
  const [form, setForm] = useState({ name: '', company: '', email: '', value: 1000 });

  function refresh() {
    const d = loadDb();
    setDb(d);
    onChange?.();
  }

  function addLead(e: React.FormEvent) {
    e.preventDefault();
    const lead: Lead = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      value: Number(form.value) || 0,
      stage: 'New',
      score: 0,
      lastActivityAt: Date.now(),
      createdAt: Date.now(),
      owner: 'Unassigned',
      lostReason: '',
    };
    const next = { ...db, leads: [lead, ...db.leads] };
    saveDb(next);
    setForm({ name: '', company: '', email: '', value: 1000 });
    refresh();
  }

  function updateLead(lead: Lead, updates: Partial<Lead>) {
    const updated = { ...lead, ...updates } as Lead;
    const next = { ...db, leads: db.leads.map((l) => (l.id === lead.id ? updated : l)) };
    saveDb(next);
    refresh();
  }

  const visible = useMemo(() => db.leads.slice(0, 100), [db.leads]);

  return (
    <div className="stack-lg">
      <form onSubmit={addLead} className="row">
        <div className="col-3"><input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="col-3"><input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div className="col-3"><input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="col-3"><input className="input" type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} min={0} /></div>
        <div className="col-3"><button className="btn primary" type="submit">Add Lead</button></div>
      </form>

      <hr className="sep" />

      <div className="small">Showing {visible.length} of {db.leads.length} leads</div>

      {visible.map((lead) => (
        <div key={lead.id} className="lead">
          <div className="kv"><strong>{lead.name}</strong><span className="badge">{lead.stage}</span></div>
          <div className="kv small"><span>{lead.company || '?'} ? {lead.email || '?'}</span><span>Value: ${lead.value.toLocaleString()}</span></div>
          <div className="kv small"><span>Owner: {lead.owner}</span><span>Score: {lead.score}</span></div>
          <div style={{ display:'flex', gap: '.5rem', marginTop: '.5rem' }}>
            <select className="input" value={lead.stage} onChange={(e) => updateLead(lead, { stage: e.target.value as LeadStage })}>
              {['New','Qualified','Proposal','Negotiation','Won','Lost'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn secondary" onClick={() => updateLead(lead, { score: computeLeadScore(lead) })}>Re-score</button>
            <button className="btn" onClick={() => updateLead(lead, { owner: lead.owner === 'Unassigned' ? 'Agent' : 'Unassigned' })}>
              {lead.owner === 'Unassigned' ? 'Assign to Agent' : 'Unassign'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
