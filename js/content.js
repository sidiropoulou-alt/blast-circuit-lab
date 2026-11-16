/* ============================================================
   BLAST Circuit Lab — all the words (facts, quiz, history)
   Edit this file to add your own questions and facts!
   ============================================================ */
window.BlastContent = {

  /* ---------------- Quiz ---------------- */
  quiz: [
    {
      q: "What does the battery do in a circuit?",
      answers: [
        "It pushes electricity around the loop",
        "It makes the wires grow longer",
        "It keeps the wires nice and cool"
      ],
      correct: 0,
      explain: "The battery is the power source. It pushes the electric current all the way around the loop."
    },
    {
      q: "What happens to the bulb if the circuit has a gap in it?",
      answers: [
        "It shines even brighter",
        "It goes dark, because the electricity stops",
        "It turns into a different colour"
      ],
      correct: 1,
      explain: "Electricity needs a complete loop. If there is a gap, the current cannot get through — so the bulb goes dark."
    },
    {
      q: "Which part lets you turn the electricity on and off?",
      answers: [
        "The bulb",
        "The battery",
        "The switch"
      ],
      correct: 2,
      explain: "A switch opens the loop (off) or closes it (on). That's how you control your circuit."
    },
    {
      q: "A circuit must be shaped like a…",
      answers: [
        "Complete loop with no gaps",
        "Straight line that stops",
        "Triangle that is open at one corner"
      ],
      correct: 0,
      explain: "Think of a racetrack. Electricity goes round and round the closed loop."
    },
    {
      q: "Which material lets electricity flow through it easily?",
      answers: [
        "A rubber band",
        "A copper coin",
        "A wooden ruler"
      ],
      correct: 1,
      explain: "Metals like copper are conductors — electricity flows through them easily. Rubber and wood do not."
    },
    {
      q: "Rubber and plastic are safe to touch because they are…",
      answers: [
        "Insulators — electricity cannot pass through them",
        "Very tasty",
        "Super conductors"
      ],
      correct: 0,
      explain: "Wires have a plastic or rubber coat because it is an insulator. It keeps the electricity safely inside."
    },
    {
      q: "What do we call the electricity moving around inside a wire?",
      answers: [
        "Wind",
        "Steam",
        "Electric current"
      ],
      correct: 2,
      explain: "Electric current is the flow of tiny electric charges (electrons) through the wire."
    },
    {
      q: "Which one is the SAFE thing to do?",
      answers: [
        "Never poke anything into a wall socket",
        "Take a plug socket apart to see what's inside",
        "Touch bare wires to see if they are switched on"
      ],
      correct: 0,
      explain: "Wall sockets carry powerful electricity that can really hurt. Never touch them — and always ask a grown-up for help."
    }
  ],

  /* ---------------- Fun facts ---------------- */
  facts: [
    { emoji: "🌩️", title: "Lightning is electricity!", text: "A bolt of lightning can be about 30,000 °C — around five times hotter than the surface of the Sun." },
    { emoji: "🐟", title: "Fish that make zaps", text: "An electric eel can make its own electricity — up to about 600 volts, enough to surprise a whole boat!" },
    { emoji: "💡", title: "Long-life bulbs", text: "The very first light bulbs lasted only a few hours. Some bulbs today keep shining for years." },
    { emoji: "🚀", title: "Racing fast", text: "An electric signal can travel through a wire at nearly the speed of light — about 300,000 kilometres every second." },
    { emoji: "🧦", title: "Crackling socks", text: "When socks tumble in a dryer they rub together and build up static electricity. That's the crackle you hear!" },
    { emoji: "🧠", title: "Your body is electric", text: "Tiny electric signals travel along your nerves so you can move, feel and think. You are full of electricity!" },
    { emoji: "🌍", title: "Zap, zap, zap", text: "All around the world there are about 100 lightning strikes every single second." },
    { emoji: "🐝", title: "Electric bees", text: "Honey bees can sense the tiny electric fields around flowers to help them find nectar." }
  ],

  /* ---------------- Amazing discoveries ---------------- */
  discoveries: [
    {
      when: "Around 600 BC",
      title: "Amber magic",
      who: "Thales of Miletus, in ancient Greece",
      text: "People rubbed a lump of amber (hard tree resin) with fur. Suddenly it could pull tiny feathers and bits of straw towards it! That was the very first look at static electricity."
    },
    {
      when: "1600",
      title: "Naming the invisible",
      who: "William Gilbert, doctor to Queen Elizabeth I",
      text: "Gilbert tested amber, glass, and many other materials. He found the mysterious pulling power in more than just amber, and gave it a name from the Greek word for amber: 'electricus'."
    },
    {
      when: "1752",
      title: "The kite in the storm",
      who: "Benjamin Franklin, in America",
      text: "Franklin flew a kite in a thunderstorm and showed that lightning IS electricity. It was a super dangerous experiment — never, ever try it!"
    },
    {
      when: "1800",
      title: "The first battery",
      who: "Alessandro Volta, in Italy",
      text: "Volta stacked up copper and zinc discs with salty, wet cloth between them. It made a steady electric current — the world's first battery, called the 'voltaic pile'. The volt is named after him."
    },
    {
      when: "1820",
      title: "Electricity moves a magnet",
      who: "Hans Christian Ørsted, in Denmark",
      text: "While teaching a class, Ørsted noticed a compass needle jump whenever he switched on an electric current. That surprise discovery linked electricity and magnets — electromagnetism!"
    },
    {
      when: "1879",
      title: "Lights that stayed on",
      who: "Thomas Edison and his team, in America",
      text: "Edison searched through thousands of materials to find the right glowing thread. He made a light bulb that lasted hours, so homes could finally be lit by electricity."
    },
    {
      when: "1882",
      title: "Power to the city",
      who: "The world's first central power station, New York",
      text: "Instead of a battery in every house, one big power station sent electricity along wires to hundreds of buildings. That is how most of our electricity still arrives today."
    },
    {
      when: "1895",
      title: "Seeing inside us",
      who: "Wilhelm Röntgen, in Germany",
      text: "Röntgen noticed a mysterious glow that could pass through his hand and show the bones inside. He called it an X-ray, and it started a whole new way of seeing the human body."
    }
  ]
};
