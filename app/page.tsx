"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { LeadList } from '../components/LeadList';
import { PipelineBoard } from '../components/PipelineBoard';
import { PlaybookEditor } from '../components/PlaybookEditor';
import { runAgentCycle, seedIfEmpty, selectStats } from '../lib/agent';
import { loadDb, saveDb } from '../lib/storage';

export default function Page() {
  const [tick, setTick] = useState(0);
  const db = useMemo(() => loadDb(), [tick]);
  const stats = useMemo(() => selectStats(db), [db]);

  useEffect(() => {
    seedIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    setTick((t) => t + 1);
  }

  function handleRunAgent() {
    const updated = runAgentCycle(loadDb());
    saveDb(updated);
    refresh();
  }

  return (
    <div className="stack-lg">
      <section id="dashboard" className="card">
        <h2>Dashboard</h2>
        <div className="stats">
          <div className="stat"><div className="stat-num">{stats.totalLeads}</div><div className="stat-label">Leads</div></div>
          <div className="stat"><div className="stat-num">{stats.activeLeads}</div><div className="stat-label">Active</div></div>
          <div className="stat"><div className="stat-num">{stats.won}</div><div className="stat-label">Won</div></div>
          <div className="stat"><div className="stat-num">{stats.lost}</div><div className="stat-label">Lost</div></div>
        </div>
        <button onClick={handleRunAgent} className="btn primary">Run Agent Cycle</button>
      </section>

      <section id="leads" className="card">
        <h2>Leads</h2>
        <LeadList onChange={refresh} />
      </section>

      <section id="pipeline" className="card">
        <h2>Pipeline</h2>
        <PipelineBoard onChange={refresh} />
      </section>

      <section id="playbooks" className="card">
        <h2>Playbooks</h2>
        <PlaybookEditor onChange={refresh} />
      </section>

      <section id="agent" className="card">
        <h2>Agent</h2>
        <p>The agent processes leads based on playbooks and activity history. Use "Run Agent Cycle" to apply rules.</p>
      </section>
    </div>
  );
}
