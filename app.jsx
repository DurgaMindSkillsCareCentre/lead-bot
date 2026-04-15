const { useState, useEffect } = React;

function App() {

  const [leads, setLeads] = useState([]);
  const [dmText, setDmText] = useState("");

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

  const getHeat = (score) => {
    if (score >= 70) return "hot";
    if (score >= 40) return "warm";
    return "cold";
  };

  // ===== AUTO FETCH =====
  const fetchLeads = async () => {
    const url = "https://news.google.com/rss/search?q=commercial+land+requirement+india";

    try {
      const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(url));
      const data = await res.json();

      const xml = new DOMParser().parseFromString(data.contents, "text/xml");
      const items = [...xml.querySelectorAll("item")];

      const parsed = items.map(i => {
        const title = i.querySelector("title")?.textContent;

        return {
          text: title,
          link: i.querySelector("link")?.textContent,
          score: scoreLead(title)
        };
      });

      setLeads(parsed);

      if (parsed.length > 0) {
        alert("🔥 New buyer leads found!");
      }

    } catch (e) {}
  };

  useEffect(() => {
    fetchLeads();
    setInterval(fetchLeads, 600000);
  }, []);

  // ===== DM =====
  const generateDM = () => {
    const msg = `Hi, saw your requirement.

Premium commercial land at Alagarkovil Highway, Madurai.

📞 WhatsApp:
https://wa.me/919884198930`;

    setDmText(msg);
  };

  // ===== AUTO EMAIL LINK =====
  const autoEmail = (lead) => {
    const subject = "New Buyer Lead AUTO";
    const body = `New Lead Found:

${lead.text}

${lead.link}`;

    // Gmail compose (fastest possible method)
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=smartpos.systems@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  return (
    <div style={{padding:"10px"}}>

      <h2>🚀 Lead Bot AI</h2>

      {leads.map((l,i)=>(
        <div className={`card ${getHeat(l.score)}`} key={i}>
          <b>{l.text}</b>
          <p>Score: {l.score}</p>

          <button onClick={()=>window.open(l.link)}>
            🔗 Open
          </button>

          <button onClick={generateDM}>
            📲 WhatsApp
          </button>

          <button onClick={()=>autoEmail(l)}>
            📧 Auto Email
          </button>
        </div>
      ))}

      <div className="card cold">
        <textarea rows="6" value={dmText} readOnly />

        <button onClick={()=>{
          navigator.clipboard.writeText(dmText);
        }}>
          Copy
        </button>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);