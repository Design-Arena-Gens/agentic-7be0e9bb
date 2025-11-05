"use client";

import React from 'react';
import { Db, Lead } from '../lib/types';
import { loadDb, saveDb } from '../lib/storage';

const STAGES: Array<Lead['stage']> = ['New', 'Qualified', 'Proposal', 'Negotiation'];

export function PipelineBoard({ onChange }: { onChange?: () => void }) {
  const db: Db = loadDb();

  function move(lead: Lead, dir: -1 | 1) {
    const idx = STAGES.indexOf(lead.stage as any);
    const nextStage = STAGES[Math.max(0, Math.min(STAGES.length - 1, idx + dir))];
    const next = { ...db, leads: db.leads.map((l) => (l.id === lead.id ? { ...lead, stage: nextStage } : l)) };
    saveDb(next);
    onChange?.();
  }

  return (
    <div className="board">
      {STAGES.map((stage) => (
        <div key={stage} className="column">
          <h3>{stage}</h3>
          {db.leads.filter((l) => l.stage === stage).map((lead) => (
            <div key={lead.id} className="lead">
              <div className="kv"><strong>{lead.name}</strong><span className="badge">{lead.score}</span></div>
              <div className="kv small"><span>{lead.company || '?'}</span><span>${lead.value.toLocaleString()}</span></div>
              <div style={{ display:'flex', gap: '.5rem', marginTop: '.5rem' }}>
                <button className="btn secondary" onClick={() => move(lead, -1)}>?</button>
                <button className="btn secondary" onClick={() => move(lead, +1)}>?</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
