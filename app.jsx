const { useState, useEffect } = React;

function App() {

  const [tab, setTab] = useState("add");
  const [leads, setLeads] = useState([]);
  const [input, setInput] = useState("");
  const [dmText, setDmText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("leads");
    if (saved) setLeads(JSON.parse(saved));
  }, []);

  const saveLeads = (data) => {
    setLeads(data);
    localStorage.setItem("leads", JSON.stringify(data));
  };

  const scoreLead = (text) => {
    let score = 0;
    const t = text.toLowerCase();

    if (t.includes("madurai")) score += 30;
    if (t.includes("commercial")) score += 20;
    if (t.includes("land")) score += 10;
    if (t.includes("urgent")) score += 25;
    if (t.includes("highway")) score += 20;

    return score;
  };

  const getHeat = (score) => {
    if (score >= 70) return "hot";
    if (score >= 40) return "warm";
    return "cold";
  };

  const addLead = () => {
    if (!input) return;

    const newLead = {
      text: input,
      link: input.includes("http") ? input : "",
      score: scoreLead(input),
      status: "NEW"
    };

    saveLeads([newLead, ...leads]);
    setInput("");
  };

  const updateStatus = (i, status) => {
    const updated = [...leads];
    updated[i].status = status;
    saveLeads(updated);
  };

  const generateDM = (lead) => {
    const msg = `Hi, saw your requirement.

We have premium corner commercial land at Alagarkovil Highway Junction, Madurai.

23.5 cents | 46 ft frontage | Junction property

Ideal for petrol bunk, restaurant, retail.

📍 Location:
https://maps.app.goo.gl/eAFMxyM9U486QqsS8

📞 WhatsApp:
https://wa.me/919884198930

Direct owner sale — No brokers`;

    setDmText(msg);
    setTab("dm");
  };

  const followUps = [
    "Just checking if you reviewed the property details.",
    "Few inquiries ongoing—let me know if interested.",
    "Happy to assist when your requirement becomes active."
  ];

  return (
    <div style={{padding:"10px"}}>

      <h2>🚀 Lead Bot ULTIMATE</h2>

      <div>
        <button onClick={()=>setTab("add")}>Add Lead</button>
        <button onClick={()=>setTab("pipeline")}>Pipeline</button>
        <button onClick={()=>setTab("dm")}>DM</button>
        <button onClick={()=>setTab("follow")}>Follow-up</button>
      </div>

      {tab==="add" && (
        <div className="card cold">
          <input 
            placeholder="Paste FB link or requirement"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
          />
          <button onClick={addLead}>➕ Add</button>
        </div>
      )}

      {tab==="pipeline" && leads.map((l,i)=>(
        <div className={`card ${getHeat(l.score)}`} key={i}>
          <p>{l.text}</p>
          <p>Score: {l.score}</p>
          <p>Status: {l.status}</p>

          {l.link && (
            <button onClick={()=>window.open(l.link,"_blank")}>🔗 Open</button>
          )}

          <button onClick={()=>generateDM(l)}>🤖 DM</button>
          <button onClick={()=>updateStatus(i,"CONTACTED")}>📩</button>
          <button onClick={()=>updateStatus(i,"FOLLOWUP")}>🔁</button>
          <button onClick={()=>updateStatus(i,"CLOSED")}>✅</button>
        </div>
      ))}

      {tab==="dm" && (
        <div className="card cold">
          <textarea rows="10" value={dmText} readOnly />
          <button onClick={()=>navigator.clipboard.writeText(dmText)}>📋 Copy</button>
          <button onClick={()=>{
            window.open("https://wa.me/919884198930?text=" + encodeURIComponent(dmText));
          }}>📲 WhatsApp</button>
        </div>
      )}

      {tab==="follow" && followUps.map((f,i)=>(
        <div className="card warm" key={i}>
          <p>{f}</p>
          <button onClick={()=>{
            window.open("https://wa.me/919884198930?text=" + encodeURIComponent(f));
          }}>📲 Send</button>
        </div>
      ))}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);