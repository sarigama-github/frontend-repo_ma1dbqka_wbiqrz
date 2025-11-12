import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const palette = {
  primary: "#0f172a", // 80%
  accent: "#22d3ee", // 20%
  highlight: "#f59e0b", // 10%
};

function Badge({ children, color = "bg-emerald-500" }) {
  return (
    <span className={`${color} text-white text-xs px-2 py-0.5 rounded-full`}>{children}</span>
  );
}

function TopBar({ onSearch }) {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-white/5 backdrop-blur">
      <div className="text-white/80 font-semibold">Fleet Manager</div>
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search vehicles, loads, routes..."
        className="w-96 max-w-[50vw] bg-white/10 text-white placeholder-white/50 px-3 py-2 rounded-md outline-none border border-white/10 focus:border-cyan-300/60 transition"
      />
      <div className="flex items-center gap-3">
        <button className="relative">
          <span className="absolute -top-1 -right-1 bg-orange-400 text-[10px] text-white px-1 rounded">5</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white/80"><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-sky-600 ring-2 ring-white/20" />
      </div>
    </div>
  );
}

function LeftSidebar({active, setActive}) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
    { id: "fleet", label: "Fleet", icon: "M4 6h16v12H4z" },
    { id: "loads", label: "Loads", icon: "M4 4h16v16H4z" },
    { id: "wallet", label: "Wallet", icon: "M3 7h18v10H3z" },
    { id: "docs", label: "Documents", icon: "M6 2h9l5 5v13H6z" },
    { id: "history", label: "History", icon: "M12 8v5l3 3" },
    { id: "profile", label: "Profile", icon: "M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5Z" },
  ];
  return (
    <div className="w-60 h-full border-r border-white/10 bg-white/5 backdrop-blur flex flex-col">
      <div className="px-4 py-3 text-white/60 text-xs">Menu</div>
      <div className="flex-1 overflow-y-auto">
        {items.map(it => (
          <button key={it.id} onClick={()=>setActive(it.id)} className={`w-full text-left px-4 py-2 flex items-center gap-3 text-white/80 hover:bg-white/10 ${active===it.id?"bg-cyan-400/20 text-white": ""}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80"><path d={it.icon} stroke="currentColor" strokeWidth="1.5"/></svg>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-white/10">
        <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-md">Logout</button>
      </div>
    </div>
  );
}

function RightSidebar({engineOn,setEngineOn}) {
  return (
    <div className="w-72 h-full border-l border-white/10 bg-white/5 backdrop-blur flex flex-col">
      <div className="px-4 py-3 text-white/60 text-xs">Settings</div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white/80">Engine</span>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={engineOn} onChange={e=>setEngineOn(e.target.checked)} />
            <div className="w-10 h-5 bg-white/20 rounded-full peer-checked:bg-emerald-400 relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 peer-checked:after:translate-x-5 after:transition" />
          </label>
        </div>
        <div className="space-y-2">
          <div className="text-white/60 text-xs">Theme</div>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded" style={{background: palette.primary}} />
            <div className="w-6 h-6 rounded" style={{background: palette.accent}} />
            <div className="w-6 h-6 rounded" style={{background: palette.highlight}} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="h-64 rounded-xl bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 to-slate-900/20" />
      <div className="absolute top-3 left-3 text-white/80 text-sm">Active vehicles on map</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-cyan-400/30 border border-cyan-300/40 animate-pulse relative">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-400 rounded-full border-2 border-white shadow-xl" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white shadow-xl" />
        </div>
      </div>
    </div>
  );
}

function LoadCard({load, onAccept}) {
  const statusColor = {
    open: "bg-cyan-500",
    accepted: "bg-emerald-500",
    in_transit: "bg-blue-500",
    delivered: "bg-gray-500",
  }[load.status] || "bg-slate-500";

  const disabled = ["accepted", "in_transit", "delivered"].includes(load.status) || load.vehicle_accepted || load.vehicle_loaded;

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-300/40 transition">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 flex items-center justify-center text-white font-bold">
          {load.vehicle_type?.[0]?.toUpperCase() || "T"}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-white font-medium">{load.product_name}</div>
            <Badge color={statusColor}>{load.status}</Badge>
          </div>
          <div className="text-white/70 text-sm">{load.loading_address} → {load.unloading_address}</div>
          <div className="text-white/50 text-xs">{load.weight || "-"}t • {load.dimensions || "-"} • {load.distance_km || "-"}km</div>
        </div>
        <div className="text-right">
          <div className="text-cyan-300 text-lg font-semibold">${load.amount.toFixed(2)}</div>
          <div className="text-white/60 text-xs">{load.rating ?? "4.6"}★</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input disabled={disabled} type="number" defaultValue={load.amount} className="w-28 bg-white/10 text-white px-2 py-1 rounded border border-white/10" />
        <button disabled={disabled} onClick={()=>onAccept(load)} className={`px-3 py-1 rounded-md ${disabled?"bg-white/10 text-white/40 cursor-not-allowed":"bg-cyan-500 hover:bg-cyan-400 text-white"}`}>{load.vehicle_loaded?"Loaded":load.vehicle_accepted?"Accepted":"Accept"}</button>
      </div>
    </div>
  );
}

function Dashboard({ loads, onAccept }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8 space-y-4">
        <MapCard />
        <div className="grid md:grid-cols-2 gap-3">
          {loads.map(l=> <LoadCard key={l.id} load={l} onAccept={onAccept} />)}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-white/80 font-medium mb-2">Fleet Summary</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-slate-800/60 text-white">
              <div className="text-xs text-white/60">Active</div>
              <div className="text-2xl">12</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 text-white">
              <div className="text-xs text-white/60">Loaded</div>
              <div className="text-2xl">7</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 text-white">
              <div className="text-xs text-white/60">Fuel</div>
              <div className="text-2xl">68%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-800/60 text-white">
              <div className="text-xs text-white/60">Speed</div>
              <div className="text-2xl">54km/h</div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-white/80 font-medium mb-2">Notifications</div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {["Vehicle verified","Load confirmed","Fuel theft alert","Wallet debited"].map((n,i)=> (
              <div key={i} className="p-2 rounded-md bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="text-white/80 text-sm">{n}</div>
                <button className="text-white/50 hover:text-white/80 text-xs">Delete</button>
              </div>
            ))}
          </div>
          <div className="mt-2 text-right">
            <button className="text-white/60 hover:text-white">Clear all</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [engineOn, setEngineOn] = useState(true);
  const [loads, setLoads] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(()=>{
    fetch(`${API}/loads`).then(r=>r.json()).then(setLoads).catch(()=>{
      setLoads([
        {id:"1", vehicle_type:"truck", amount:420, loading_address:"NYC", unloading_address:"Boston", product_name:"Steel Coils", weight:20, dimensions:"10x2x2m", distance_km:350, rating:4.7, status:"open"},
        {id:"2", vehicle_type:"container", amount:780, loading_address:"LA", unloading_address:"SF", product_name:"Electronics", weight:12, dimensions:"6x2x2m", distance_km:620, rating:4.9, status:"accepted", vehicle_accepted:true},
      ]);
    })
  },[]);

  const onAccept = async (load) => {
    try {
      await fetch(`${API}/loads/${load.id}/accept?vehicle_id=dummy`, {method:"POST"});
      setToast({type:"success", message:"Load accepted"});
      setLoads(prev => prev.map(l=> l.id===load.id ? {...l, status:"accepted", vehicle_accepted:true}: l));
      setTimeout(()=>setToast(null), 2000);
    } catch {
      setToast({type:"error", message:"Failed to accept"});
    }
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden" style={{background: palette.primary}}>
      <div className="flex flex-col h-full">
        <TopBar onSearch={()=>{}} />
        <div className="flex flex-1 h-[calc(100vh-56px)]">
          <LeftSidebar active={active} setActive={setActive} />
          <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
            {active === "dashboard" && <Dashboard loads={loads} onAccept={onAccept} />}
          </main>
          <RightSidebar engineOn={engineOn} setEngineOn={setEngineOn} />
        </div>
      </div>

      {toast && (
        <div className={"fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white shadow-lg border backdrop-blur "+ (toast.type==='success'?'bg-emerald-500/80 border-emerald-400/60':'bg-rose-500/80 border-rose-400/60') }>
          {toast.message}
        </div>
      )}
    </div>
  );
}
