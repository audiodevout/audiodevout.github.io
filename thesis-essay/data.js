// Thesis data structure for "Equilibrium: Noise ; Magic ; System"
// All essay sections, media, and sketch mappings

const THESIS_DATA = {
  meta: {
    title: "Equilibrium: Noise ; Magic ; System",
    author: "Atharva Gupta",
    year: 2025,
    description:
      "A distributed essay investigating equilibrium as a lived, perceptual, and systemic experience through noise, magic, and systems.",
  },

  sections: [
    {
      id: "introduction",
      label: "Intro",
      title: "Introduction & Concept",
      subtitle: "Tuning rather than controlling",
      sketch: "noise-field",
      color: "#808080",
      position: { x: 0.25, y: 0.35 },
      content: `
        <p>I work as a generalist artist, moving between sonic sculpture, generative systems, digital environments, and phenomenological inquiry. My practice revolves around <strong>tuning rather than controlling</strong>—I construct systems that behave autonomously or semi-autonomously, and I work within the fluctuations they produce.</p>
        
        <p>This position allows me to bring together multiple domains: abstraction and representation, acoustics, cybernetics, sensory experience, chance procedures, technological processes, and everyday materials—without reducing them to a single narrative.</p>
        
        <h2>The Conceptual Triad</h2>
        
        <p>The central concern of this thesis is <em>equilibrium</em>: not as a fixed state, but as a perceptual and emotional rhythm that arises momentarily between disturbance and coherence. To investigate this, I work with a conceptual triad:</p>
        
        <ul>
          <li><strong>Noise</strong> represents fluctuation, multiplicity, and instability</li>
          <li><strong>Magic</strong> refers to perceptual transformation and moments of wonder—experiences that momentarily shift perception</li>
          <li><strong>Systems</strong> describe the structures and feedback loops that hold phenomena long enough to be sensed</li>
        </ul>
        
        <p>These are not stages or causes, but forces that coexist and interact in my installations.</p>
        
        <blockquote>
          "Art should comfort the disturbed and disturb the comfortable."
        </blockquote>
        
        <p>This positions art as a regulator—oscillating between tension and release, chaos and coherence. The artist becomes a tuner or facilitator of balance, not a controller.</p>
      `,
      media: [],
    },

    {
      id: "noise",
      label: "Noise",
      title: "Noise",
      subtitle: "Fluctuation, entropy, and multiplicity",
      sketch: "particle-drift",
      color: "#808080",
      position: { x: 0.7, y: 0.25 },
      content: `
        <p>Noise is never singular. It can appear as randomness, entropy, a jumble of thoughts, or even moments of madness. Sometimes it is white noise, sometimes it fluctuates between zero and one. This multiplicity—its capacity to exist across different layers and modalities—is central to my research.</p>
        
        <h2>Forms of Noise</h2>
        
        <ul>
          <li><strong>Sonic noise</strong> — white noise, static, environmental ambience</li>
          <li><strong>Visual noise</strong> — grain, interference, glitch</li>
          <li><strong>Digital noise</strong> — random values, perlin noise, entropy</li>
          <li><strong>Signal noise</strong> — interference in communication</li>
          <li><strong>Mental noise</strong> — scattered thoughts, anxiety, tinnitus</li>
          <li><strong>Emotional noise</strong> — overwhelm, confusion</li>
          <li><strong>Social noise</strong> — information overload, discourse</li>
        </ul>
        
        <h2>Noise as Cultural Force</h2>
        
        <blockquote>
          "Every social order begins as noise, becomes structured as 'music,' and eventually collapses into new noise again."
          <br><em>— Jacques Attali</em>
        </blockquote>
        
        <p>Following Attali, noise operates as cycles of order, rupture, and social equilibrium. In information theory (Shannon), noise is analogous to entropy—uncertainty that both disrupts and enables communication. In acoustics and physics, noise manifests as spectral resonance and quantum uncertainty.</p>
        
        <p>Noise introduces fluctuation. It destabilizes equilibrium, introduces randomness, chaos, or rupture. But this disturbance is generative—it creates the conditions for new patterns to emerge.</p>
      `,
      media: [],
    },

    {
      id: "magic",
      label: "Magic",
      title: "Magic",
      subtitle: "Perceptual transformation and wonder",
      sketch: "glow-particles",
      color: "#808080",
      position: { x: 0.15, y: 0.65 },
      content: `
        <p>By magic I don't mean the mystical or supernatural, but the experience of wonder—the subtle perceptual shifts that occur when a system behaves in ways that are unexpected, strange, or slightly off. This applies across physical systems, digital systems, and expanded interactive environments, wherever noise can manifest and affect perception.</p>
        
        <h2>Techno-Gnosis</h2>
        
        <p>Machines inspire awe because they mirror invisible systems—data, thought, energy. In my context, the technological sculpture becomes a <strong>ritual object</strong>: something that mediates between inner sensation and external system. It's a space where attention transforms ordinary phenomena into moments of wonder.</p>
        
        <h2>The Return of Aura</h2>
        
        <p>Walter Benjamin described aura as the unique presence that resists mechanical reproduction. For me, aura returns not as nostalgia but as <em>attunement</em>: when a machine behaves unpredictably, when a tone sustains just long enough to feel alive, a micro-aura emerges.</p>
        
        <blockquote>
          Magic transforms perception—turns noise into meaning.
        </blockquote>
        
        <p>Magic reintroduces coherence through perception, wonder, or affective alignment. It is the moment when the system's behavior transcends its mechanical nature and becomes something felt.</p>
        
        <h2>Sensory Wonder</h2>
        
        <p>I'm interested in perceptual sensory experience rather than awe. Noise can take many forms: quiet, intrusive, subtle, overwhelming. It can comfort the disturbed and disturb the comfortable. In this sense, art becomes a space for gentle perturbations, where sensory experience is shaped by contrast, ambiguity, and variability.</p>
      `,
      media: [],
    },

    {
      id: "systems",
      label: "Systems",
      title: "Systems",
      subtitle: "Feedback, homeostasis, and ritual",
      sketch: "sine-cosine-graph",
      color: "#808080",
      position: { x: 0.6, y: 0.7 },
      content: `
        <p>Systems crystallize meaning into structure. They are the feedback structures, rituals, algorithms, frameworks, or machines that stabilize or formalize fluctuations into patterns. But every structure eventually accumulates new noise.</p>
        
        <h2>Cybernetic Foundations</h2>
        
        <p>Drawing from Gregory Bateson, W. Ross Ashby, and Norbert Wiener, I understand systems through cybernetics—feedback, homeostasis, and self-regulation. A system is not static; it maintains itself through constant adjustment.</p>
        
        <div class="diagram">
          <div class="diagram-title">Equilibrium Cycle</div>
          <p style="text-align: center; font-family: var(--font-mono); color: var(--text-secondary);">
            Noise → Magic → System → (new) Noise<br>
            ↑___________________________↓
          </p>
        </div>
        
        <h2>Three System Types</h2>
        
        <ul>
          <li><strong>Physical systems</strong> — motors, sensors, rain sticks, weather-driven data</li>
          <li><strong>Sonic systems</strong> — sustained tones, mechanical rhythms, resonant feedback</li>
          <li><strong>Social systems</strong> — participants' gestures altering motion or sound; collective attunement</li>
        </ul>
        
        <p>Each work is a feedback loop where perception and environment continually recalibrate. The kinetic-sonic sculptures operate as partially autonomous agents whose emergent sound, motion, and behavior become sites for perceiving equilibrium.</p>
        
        <h2>Systems as Ritual</h2>
        
        <blockquote>
          "A balance among environmental, social, and mental systems."
          <br><em>— Félix Guattari</em>
        </blockquote>
        
        <p>My sculptures enact technological ecologies that link physical environment (weather, sound), social interaction (audience participation), and inner response (healing, reflection). They function as living ritual systems—repeated gestures that find balance through iteration.</p>
      `,
      media: [],
    },

    {
      id: "equilibrium",
      label: "Equilibrium",
      title: "Equilibrium",
      subtitle: "The rhythm between disturbance and stability",
      sketch: "wave-interference",
      color: "#ffffff",
      position: { x: 0.5, y: 0.5 },
      content: `
        <p>Equilibrium is not a fixed point but the rhythm of moving through states. In cybernetics or biology this is <strong>homeostasis</strong>: the ability of a system to remain alive by constantly adjusting. In acoustics it's <strong>resonance</strong>: the body or material finding frequencies where vibration sustains itself without collapse.</p>
        
        <h2>A Dynamic Balance</h2>
        
        <ul>
          <li>Noise introduces fluctuation</li>
          <li>Magic transforms perception—turns noise into meaning</li>
          <li>System crystallizes that meaning into structure</li>
          <li>But every structure eventually accumulates new noise</li>
        </ul>
        
        <p>Equilibrium, then, is the perceptual and emotional rhythm that arises momentarily between disturbance and coherence. Motors vibrate until friction balances them. Sound waves interfere until a tone feels centered. Viewers oscillate between tension and calm.</p>
        
        <h2>Healing Dimension</h2>
        
        <p>The healing dimension comes from restoring or witnessing equilibrium. This is very personal for me—the healing and equilibrium both. Equilibrium is something very short-lived; it's a feedback loop and a constant cycle of change—from "good to bad and bad to good" feeling. I chase it, I try to construct it, but I can only feel it momentarily.</p>
        
        <blockquote>
          I am tuning the artwork, I am being tuned myself through the experience of my art and all art in general—I am tuning the materials and sound generators.
        </blockquote>
        
        <p>My role as artist is not to remove noise or impose order but to <em>tune</em> the system—to design conditions where equilibrium can be felt as an ongoing negotiation. That's what connects the intellectual framework (noise–magic–system) to lived practice (healing, tinnitus, sensory balance).</p>
      `,
      media: [],
    },

    {
      id: "automatism",
      label: "Automatism",
      title: "Technological Automatism",
      subtitle: "Mechanical and algorithmic emergence",
      sketch: "recursive-tree",
      color: "#808080",
      position: { x: 0.85, y: 0.5 },
      content: `
        <p>Technological automatism—processes in which mechanical or algorithmic systems generate behavior beyond my direct control—is a key method through which noise, magic, and systems interact. The machines become collaborators rather than tools.</p>
        
        <h2>Dada/Surrealist Precedent</h2>
        
        <p>Dada and Surrealist automatism (Tzara, Hugo Ball, John Cage) serve as conceptual precedents for generativity—systems that bypass conscious control. Chance operations and indeterminacy create conditions where emergence can occur.</p>
        
        <blockquote>
          "Autonomous systems that produce outcomes independently or systems that respond to inputs—noise as an input and as an emergent property of complexity."
        </blockquote>
        
        <h2>Generative Systems</h2>
        
        <p>I design systems that behave autonomously, producing emergent patterns through:</p>
        
        <ul>
          <li>Randomness and noise functions</li>
          <li>Feedback loops</li>
          <li>Environmental input (weather data, sensors)</li>
          <li>Algorithmic rules that unfold over time</li>
        </ul>
        
        <p>Equilibrium emerges when the system "stabilizes" aesthetically or conceptually—when it produces a perceptual or emotional balance for me or the viewer. Systems remain opaque and "magical" precisely because their behavior cannot be fully predicted.</p>
        
        <h2>TouchDesigner & Noise Sculpting</h2>
        
        <p>My YouTube series "Noise Sculpting in TouchDesigner" documents this practice: educational, experimental, and a form of artistic expression. It sheds light on the randomness of generative art and how generative art benefits from unpredictability—an artistic way of sharing techniques instead of being completely technical about it.</p>
      `,
      media: [],
    },

    {
      id: "case-studies",
      label: "Case Studies",
      title: "Case Studies",
      subtitle: "Rain Reminders, Weather Sculptures, and beyond",
      sketch: "game-of-life",
      color: "#808080",
      position: { x: 0.3, y: 0.8 },
      content: `
        <h2>Rain Reminders</h2>
        
        <p>A kinetic-sonic sculpture that operates as a partially autonomous agent. The rain stick mechanism produces emergent sound patterns—healing noises that are personal and specific. The exact kind of noise that heals me is not particularly healing for everyone; its therapeutic quality is contextual, subjective, and personal.</p>
        
        <p>With Rain Reminders, the magic is sensory. The system is how everything works—the rules being followed. Healing is just for this installation. Equilibrium is the thing that connects it all.</p>
        
        <h2>Weather Sculptures</h2>
        
        <p>Installations driven by real-time weather API data, translating environmental conditions into mechanical motion and sound. These works create technological ecologies linking physical environment, social interaction, and inner response.</p>
        
        <h2>Noise Sculpting Series</h2>
        
        <p>A YouTube series exploring generative visual techniques in TouchDesigner:</p>
        
        <ul>
          <li>Part 1: Basic UV Mapping and Noise Sculpting</li>
          <li>Part 2-4: Progressive complexity in noise-driven visuals</li>
          <li>Part 5: ParticlesGPU integration</li>
          <li>Part 6: Mesh Generator and particle structures</li>
          <li>Part 7: Ghostly Particles</li>
          <li>Part 8: Abstract Particle Structures</li>
        </ul>
        
        <p>These are conceptually independent—different applications, artistic applications—but together they form a case study of generative techniques, documenting the study of generative systems and finding chaos and equilibrium within those systems.</p>
      `,
      media: [],
    },

    {
      id: "phenomenology",
      label: "Phenomenology",
      title: "Phenomenology of Equilibrium",
      subtitle: "Sensory writing, tinnitus, and attunement",
      sketch: "particle-path",
      color: "#808080",
      position: { x: 0.75, y: 0.85 },
      content: `
        <p>Equilibrium is investigated through lived experiences. If there is a phenomenon that interests me in terms of playing with my equilibrium, I try to study it, enhance and exaggerate it with my installation work. This is phenomenology—writing from a personal sensory experience.</p>
        
        <h2>Tinnitus and Attention</h2>
        
        <p>My experience with tinnitus shapes my understanding of noise and equilibrium. The persistent internal sound creates a constant negotiation between disturbance and adaptation—a micro-ecology of attention and tuning.</p>
        
        <h2>Embodied Listening</h2>
        
        <blockquote>
          "Embodied and enactive perception"
          <br><em>— Alva Noë</em>
        </blockquote>
        
        <p>Following Noë's work on embodied perception, I understand sensory experience as active and situated. Listening is not passive reception but a form of tuning—adjusting attention, filtering noise, finding resonance.</p>
        
        <h2>Sensations, Vibrations, Warmth</h2>
        
        <p>The body becomes a site for sensing equilibrium:</p>
        
        <ul>
          <li>How does the eye move when looking at art/patterns/experiences?</li>
          <li>Sensations, vibrations, warmth as forms of knowing</li>
          <li>Closed-eyes visual work, stroboscopic images</li>
          <li>The affective intensity of pre-conscious perception (Massumi)</li>
        </ul>
        
        <p>Healing is the restoration of perceptual equilibrium—not everpresent in my art, but there in some of it. Immersive sometimes, introspective always. Magic as sensory wonder, as system behavior, or as emotional resonance.</p>
      `,
      media: [],
    },

    {
      id: "bibliography",
      label: "Bibliography",
      title: "Bibliography",
      subtitle: "Sources and references",
      sketch: "orbit-control",
      color: "#808080",
      position: { x: 0.5, y: 0.15 },
      content: `
        <h2>Theoretical Sources</h2>
        
        <ul class="bibliography-list">
          <li class="bibliography-item">
            <span class="bibliography-category">Noise & Culture</span>
            <p><span class="bibliography-author">Attali, Jacques</span> — <span class="bibliography-title">Noise: The Political Economy of Music</span>. Noise as cultural force; cycles of order, rupture, and social equilibrium.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Information Theory</span>
            <p><span class="bibliography-author">Shannon, Claude</span> — <span class="bibliography-title">A Mathematical Theory of Communication</span>. Noise, entropy, and information as systemic conditions.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Cybernetics</span>
            <p><span class="bibliography-author">Bateson, Gregory; Ashby, W. Ross; Wiener, Norbert</span> — Cybernetics, feedback, homeostasis.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Media Theory</span>
            <p><span class="bibliography-author">Benjamin, Walter</span> — <span class="bibliography-title">The Work of Art in the Age of Mechanical Reproduction</span>. Aura, reproducibility, technical ritual.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Ecology</span>
            <p><span class="bibliography-author">Guattari, Félix</span> — <span class="bibliography-title">The Three Ecologies</span>. Ecological entanglement of mental, social, and environmental systems.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Posthumanism</span>
            <p><span class="bibliography-author">Haraway, Donna</span> — Hybrid beings, situatedness, machine-human entanglement.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Automatism</span>
            <p><span class="bibliography-author">Tzara, Tristan; Ball, Hugo</span> — Dada automatism and chance.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Music</span>
            <p><span class="bibliography-author">Cage, John</span> — Indeterminacy, chance operations, and open sound structures.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Techno-Gnosis</span>
            <p><span class="bibliography-author">Davis, Erik</span> — <span class="bibliography-title">Techgnosis</span>. Perceptual magic and technology.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Philosophy</span>
            <p><span class="bibliography-author">Serres, Michel</span> — <span class="bibliography-title">The Parasite</span>. Parasitic interference, relationality, and systemic noise.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Philosophy</span>
            <p><span class="bibliography-author">Deleuze, Gilles & Guattari, Félix</span> — Multiplicity, rhizomatic structures, and entanglement.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Perception</span>
            <p><span class="bibliography-author">Noë, Alva</span> — Embodied and enactive perception.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Complexity</span>
            <p><span class="bibliography-author">Prigogine, Ilya</span> — Self-organization and non-linear dynamics.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Music/Systems</span>
            <p><span class="bibliography-author">Borgo, David</span> — Emergence and improvisation as complex systems.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Affect</span>
            <p><span class="bibliography-author">Massumi, Brian</span> — Affective intensity and pre-conscious perception.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">STS</span>
            <p><span class="bibliography-author">Latour, Bruno</span> — Distributed agency and relational systems.</p>
          </li>
        </ul>
        
        <h2>Artistic References</h2>
        
        <ul class="bibliography-list">
          <li class="bibliography-item">
            <span class="bibliography-category">Kinetic-Sonic</span>
            <p><span class="bibliography-author">Moritz Simon Geist, Trimpin, Yuri Suzuki</span> — Kinetic-sonic machines and autonomous systems.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Mechanical</span>
            <p><span class="bibliography-author">Zimoun</span> — Mechanical minimalism and material noise.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Historical</span>
            <p><span class="bibliography-author">Russolo, Luigi; Nancarrow, Conlon</span> — Early mechanized generativity and noise music.</p>
          </li>
          <li class="bibliography-item">
            <span class="bibliography-category">Immersive</span>
            <p><span class="bibliography-author">Philip Vermeulen, Salim Bayri</span> — Large-scale sensory systems and perceptual manipulation.</p>
          </li>
        </ul>
      `,
      media: [],
    },

    {
      id: "about",
      label: "About",
      title: "About This Thesis",
      subtitle: "Format, methodology, and the artist",
      sketch: "glow-particles",
      color: "#808080",
      position: { x: 0.9, y: 0.3 },
      content: `
        <h2>Thesis Format</h2>
        
        <p>This thesis takes a hybrid form—written, diagrammatic, and interactive—integrating documentation, reflection, and theoretical grounding. The website contains the entire thesis content: text, diagrams, media, and interactive generative modules.</p>
        
        <h2>Methodology</h2>
        
        <p>My approach is practice-led, phenomenological, and interdisciplinary. Making is my primary mode of inquiry; reflection and theoretical insight emerge from engaging with the works themselves.</p>
        
        <h3>Methods</h3>
        
        <ul>
          <li><strong>Artistic experimentation</strong>: constructing kinetic-sonic installations and generative systems</li>
          <li><strong>Technological automatism</strong>: designing autonomous systems producing emergent patterns</li>
          <li><strong>Phenomenological writing</strong>: sensory field notes, reflections on tinnitus, attention, resonance</li>
          <li><strong>Systems mapping</strong>: diagrams and flowcharts modeling interactions</li>
          <li><strong>Case studies</strong>: detailed documentation of installations</li>
          <li><strong>Archival and media analysis</strong>: Noise Sculpting YouTube series as research artefacts</li>
        </ul>
        
        <h2>About the Artist</h2>
        
        <p><strong>Atharva Gupta</strong> is a generalist artist working between sonic sculpture, generative systems, digital environments, and phenomenological inquiry. Based on an interdisciplinary mindset, moving freely between art, theory, technology, and science.</p>
        
        <blockquote>
          "Embodied conceptualism: ideas are inseparable from the act of making and sensing."
        </blockquote>
        
        <h2>Guiding Questions</h2>
        
        <ol>
          <li>How do noise, magic, and systems operate as interdependent forces within my installations?</li>
          <li>How does technological automatism enable emergent behaviors that shift perception or induce moments of equilibrium?</li>
          <li>How can equilibrium be investigated as a sensory, emotional, and systemic experience through kinetic-sonic and generative artworks?</li>
          <li>How does my generalist position influence the way I frame, connect, and interpret these concepts?</li>
          <li>In what ways can artistic systems function like ritual objects—mediating between the environment, the machine, and the perceiver?</li>
        </ol>
      `,
      media: [],
    },
  ],

  // Animation configuration
  config: {
    particleDrift: 0.15,
    glowIntensity: 0.8,
    connectionDistance: 150,
    cursorRepulsion: 80,
    transitionDuration: 500,
  },
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = THESIS_DATA
}
