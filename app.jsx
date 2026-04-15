const { useState, useEffect } = React;

function App() {

  const [tab, setTab] = useState("feed");
  const [leads, setLeads] = useState([]);
  const [dmText, setDmText] = useState("");
  const [loading, setLoading] = useState(true);

  // ===== SCORING =====
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

  const getBadge = (score) => {
    if (score >= 70) return {label:"HOT ", cls:"hot"};
    if (score >= 40) return {label:"WARM ", cls:"warm"};
    return {label:"COLD ", cls:"cold"};
  };

  // ===== FALLBACK =====
  const demo = [
    { text:"Need commercial land Madurai urgent", score:85 },
    { text:"Looking petrol bunk land highway", score:75 },
    { text:"Investment land Tamil Nadu", score:45 }
  ];

  // ===== FETCH =====
  const fetchLeads = async () => {
    setLoading(true);

    const url = "https://news.google.com/rss/search?q=commercial+land+india";

    try {
      const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url));
      const data = await res.json();

      const xml = new DOMParser().parseFromString(data.contents, "text/xml");
      const items = [...xml.querySelectorAll("item")];

      const parsed = items.map(i => ({
        text: i.querySelector("title")?.textContent,
        link: i.querySelector("link")?.textContent,
        score: scoreLead(i.querySelector("title")?.textContent || "")
      }));

      setLeads(parsed.length ? parsed : demo);

    } catch {
      setLeads(demo);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ===== DM =====
  const generateDM = () => {
    setDmText(`Hi, saw your requirement.

Premium commercial land at Alagarkovil Highway, Madurai.

Call/WhatsApp:
https://wa.me/919884198930`);
    setTab("dm");
  };

  return (
    <div>

      <div className="header"> Lead Bot PRO</div>

      <div className="container">

        {tab==="feed" && (
          <>
            <button onClick={fetchLeads}> Refresh Leads</button>

            {loading && <p>Loading...</p>}

            {leads.map((l,i)=>{
              const b = getBadge(l.score);

              return (
                <div className="card" key={i}>
                  <b>{l.text}</b>

                  <div className={`badge ${b.cls}`}>{b.label}</div>

                  {l.link && (
                    <button onClick={()=>window.open(l.link)}>
                       Open Source
                    </button>
                  )}

                  <button onClick={generateDM}>
                     WhatsApp DM
                  </button>
                </div>
              );
            })}
          </>
        )}

        {tab==="search" && (
          <div className="card">
            <button onClick={()=>window.open("https://www.google.com/search?q=need+land+madurai")}>
               Google Buyers
            </button>

            <button onClick={()=>window.open("https://www.facebook.com/search/posts?q=land%20requirement")}>
               Facebook Posts
            </button>

            <button onClick={()=>window.open("https://www.facebook.com/groups/search/?q=real%20estate")}>
               Facebook Groups
            </button>
          </div>
        )}

        {tab==="dm" && (
          <div className="card">
            <textarea rows="6" value={dmText} readOnly />

            <button onClick={()=>{
              navigator.clipboard.writeText(dmText);
            }}>
               Copy
            </button>

            <button onClick={()=>{
              window.open("https://wa.me/919884198930?text=" + encodeURIComponent(dmText));
            }}>
               WhatsApp
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button onClick={()=>setTab("feed")}> Leads</button>
        <button onClick={()=>setTab("search")}> Search</button>
        <button onClick={()=>setTab("dm")}> DM</button>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);