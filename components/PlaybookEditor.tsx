"use client";

import React, { useState } from 'react';
import { Db, PlaybookRule } from '../lib/types';
import { loadDb, saveDb } from '../lib/storage';

export function PlaybookEditor({ onChange }: { onChange?: () => void }) {
  const [db, setDb] = useState<Db>(() => loadDb());
  const [rule, setRule] = useState<PlaybookRule>({
    id: '',
    name: 'Auto-qualify high value',
    condition: { minValue: 5000, maxDaysSinceActivity: 7 },
    action: { setStage: 'Qualified', addTask: 'Send intro email' },
  });

  function refresh() {
    setDb(loadDb());
    onChange?.();
  }

  function addRule(e: React.FormEvent) {
    e.preventDefault();
    const newRule: PlaybookRule = { ...rule, id: crypto.randomUUID() };
    const next = { ...db, playbooks: { rules: [newRule, ...db.playbooks.rules] } };
    saveDb(next);
    refresh();
  }

  function removeRule(id: string) {
    const next = { ...db, playbooks: { rules: db.playbooks.rules.filter((r) => r.id !== id) } };
    saveDb(next);
    refresh();
  }

  return (
    <div className="stack-lg">
      <form onSubmit={addRule} className="row">
        <div className="col-4"><input className="input" placeholder="Rule name" value={rule.name} onChange={(e) => setRule({ ...rule, name: e.target.value })} required /></div>
        <div className="col-3"><input className="input" type="number" placeholder="Min value" value={rule.condition.minValue} onChange={(e) => setRule({ ...rule, condition: { ...rule.condition, minValue: Number(e.target.value) } })} min={0} /></div>
        <div className="col-3"><input className="input" type="number" placeholder="Max days inactive" value={rule.condition.maxDaysSinceActivity} onChange={(e) => setRule({ ...rule, condition: { ...rule.condition, maxDaysSinceActivity: Number(e.target.value) } })} min={1} /></div>
        <div className="col-3">
          <select className="input" value={rule.action.setStage} onChange={(e) => setRule({ ...rule, action: { ...rule.action, setStage: e.target.value as any } })}>
            {['New','Qualified','Proposal','Negotiation','Won','Lost'].map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
        <div className="col-4"><input className="input" placeholder="Add task" value={rule.action.addTask || ''} onChange={(e) => setRule({ ...rule, action: { ...rule.action, addTask: e.target.value } })} /></div>
        <div className="col-3"><button className="btn primary" type="submit">Add Rule</button></div>
      </form>

      <hr className="sep" />

      {db.playbooks.rules.length === 0 && <div className="small">No rules yet.</div>}
      {db.playbooks.rules.map((r) => (
        <div key={r.id} className="lead">
          <div className="kv"><strong>{r.name}</strong><span className="badge">Stage ? {r.action.setStage}</span></div>
          <div className="small">If value ? ${r.condition.minValue} and inactive ? {r.condition.maxDaysSinceActivity} days, then set stage and add task ?{r.action.addTask || '?'}?.</div>
          <div style={{ marginTop: '.5rem' }}>
            <button className="btn secondary" onClick={() => removeRule(r.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}
