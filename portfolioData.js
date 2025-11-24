/**
 * portfolioData.js - Portfolio Content Data
 *
 * PURPOSE: Centralized data structure for all portfolio content
 * STRUCTURE:
 *   - projects: soundInstallations, performance, installations, drawings, writing
 *   - exhibitions: chronological list of exhibitions/presentations
 *   - contact: about, cv, social links
 *   - pageContent: homepage content
 *
 * NOTE: Media paths are configured for GitHub Pages compatibility
 */

try {
  const portfolioData = {
    // ===========================================
    // PROJECTS
    // ===========================================
    projects: {
      // -------------------------------------------
      // SOUND INSTALLATIONS (Asymmetrica Audio Collection)
      // Sorted alphabetically by title
      // -------------------------------------------
      soundInstallations: [
        {
          id: "asymmetrica-a-reasonable-crashout",
          title: "A Reasonable Crashout",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Frequency modulation study by asymmetrica, balancing chaos and control.",
          fullDescription:
            "A Reasonable Crashout is a deliberately unstable composition—a digital homage to modular synthesis built entirely in Ableton. The track oscillates between glitchy randomness and hypnotic repetition, filled with jittery pattern jumps, unpredictable modulation, and a constantly morphing yet grounded melodic pulse. It's a study in fractured coherence: non-linear, algorithmically warped, but held together by an insistent sense of drive.",
          medium: "Digital audio, algorithmic sequencing, Frequency Modulation",
          technology: "Ableton Live, randomized MIDI effects, automation envelopes, FM synthesis",
          themes: "FM synthesis, intensity, sonic collapse, modularity, chaos, rhythm, generative structure",
          bandcampTracks: [
            {
              title: "a reasonable crashout",
              trackId: "4106544270",
              url: "https://asymmetrica.bandcamp.com/track/a-reasonable-crashout",
            },
          ],
        },
        {
          id: "asymmetrica-automaton",
          title: "Automaton",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "neon-magenta",
          description: "An exploration of mechanical repetition and evolving digital patterns.",
          fullDescription:
            "Automaton features repetitive motifs and incremental variations that evoke mechanized processes and evolving synthetic life.",
          medium: "Digital audio, generative patterns",
          technology: "DAW, modular synthesis, Max/MSP",
          themes: "Repetition, mechanization, generative synthesis",
          bandcampTracks: [
            {
              title: "automaton",
              trackId: "3985467816",
              url: "https://asymmetrica.bandcamp.com/track/automaton",
            },
          ],
        },
        {
          id: "asymmetrica-biding-my-time",
          title: "Biding My Time",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Glitchy percussive experiment by asymmetrica, exploring timing and texture.",
          fullDescription:
            "Biding My Time is a rhythmic study shaped through glitch techniques and Reaktor experiments. It navigates broken beats, digital stutters, and layered percussive fragments, producing an evolving sense of restless suspension.",
          medium: "Digital Audio, Reaktor",
          technology: "Bandcamp, Reaktor",
          themes: "Glitch, rhythm, experimentation",
          bandcampTracks: [
            {
              title: "biding my time",
              trackId: "1736065382",
              url: "https://asymmetrica.bandcamp.com/track/biding-my-time",
            },
          ],
        },
        {
          id: "asymmetrica-have-a-nice-last-few-days-of-summer",
          title: "Have a Nice Last Few Days of Summer",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Bell-driven experimental textures by asymmetrica, meditative yet fleeting.",
          fullDescription:
            "Have a Nice Last Few Days of Summer centers on bell tones and resonant layers. The piece balances clarity and haze, echoing cycles of memory and transition, like the shimmer of late-season light dissolving into air.",
          medium: "Digital Audio, Generative Synthesis",
          technology: "Bandcamp, bell synthesis",
          themes: "Transience, resonance, seasonal atmosphere",
          bandcampTracks: [
            {
              title: "have a nice last few days of summer",
              trackId: "1778941986",
              url: "https://asymmetrica.bandcamp.com/track/have-a-nice-last-few-days-of-summer",
            },
          ],
        },
        {
          id: "asymmetrica-not-as-i-remember-it",
          title: "Not As I Remember It",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "electric-lime",
          description: "A reflective piece examining memory through fragmented sound and abstract textures.",
          fullDescription:
            "Not As I Remember It distorts familiar motifs into abstract forms, questioning the reliability of recollection and the fluidity of sonic memory.",
          medium: "Digital audio, sound manipulation",
          technology: "DAW, field recording, granular synthesis",
          themes: "Memory, abstraction, sonic fragmentation",
          bandcampTracks: [
            {
              title: "not as i remember it",
              trackId: "750668778",
              url: "https://asymmetrica.bandcamp.com/track/not-as-i-remember-it",
            },
          ],
        },
        {
          id: "asymmetrica-stranded-deep",
          title: "Stranded Deep Series",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "neon-magenta",
          description:
            "A paired exploration of displacement and rapid flux through digital soundscapes, merging organic resonance and synthetic textures.",
          fullDescription:
            "This pair—'stranded deep' and 'stranded deep but fast'—represents a sonic dive into temporal distortion and emotional flux. These compositions juxtapose slow meditative pulses with accelerated glitch rhythms, reflecting themes of isolation and rapid change.",
          medium: "Digital audio, generative synthesis",
          technology: "DAW, granular synthesis, digital manipulation",
          themes: "Temporal manipulation, glitch aesthetics, organic-synthetic synthesis",
          bandcampTracks: [
            {
              title: "stranded deep but fast",
              trackId: "2743015108",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep-but-fast",
            },
            {
              title: "stranded deep",
              trackId: "2338898025",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep",
            },
          ],
        },
        {
          id: "asymmetrica-stretching",
          title: "Stretching",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "saffron",
          description: "A sonic exploration of elasticity and temporal extension within digital sound design.",
          fullDescription:
            "Stretching plays with time, slowing and elongating motifs to blur boundaries between moment and duration, creating a meditative auditory space.",
          medium: "Digital audio, time-stretching techniques",
          technology: "DAW, granular synthesis, field recordings",
          themes: "Temporal extension, meditative soundscapes",
          bandcampTracks: [
            {
              title: "stretching",
              trackId: "2000021307",
              url: "https://asymmetrica.bandcamp.com/track/stretching",
            },
          ],
        },
        {
          id: "asymmetrica-sublimatic",
          title: "Sublimatic",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Experimental track by asymmetrica.",
          fullDescription: "A subliminal sonic journey.",
          medium: "Digital Audio",
          bandcampTracks: [
            {
              title: "sublimatic",
              trackId: "2633361304",
              url: "https://asymmetrica.bandcamp.com/track/sublimatic",
            },
          ],
        },
        {
          id: "asymmetrica-supersounds",
          title: "Supersounds",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "electric-lime",
          description: "An experimental dive into layered synthetic timbres and expansive sound fields.",
          fullDescription:
            "Supersounds layers evolving textures and synthetic drones to create a complex soundscape that challenges perception and embraces machine improvisation.",
          medium: "Digital audio, experimental electronics",
          technology: "DAW, Max/MSP, modular synth",
          themes: "Synthetic layering, machine improvisation, drone textures",
          bandcampTracks: [
            {
              title: "supersounds",
              trackId: "960218379",
              url: "https://asymmetrica.bandcamp.com/track/supersounds",
            },
          ],
        },
        {
          id: "asymmetrica-symmetrical-fictions",
          title: "Symmetrical Fictions",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description:
            "A generative composition shaped by real-time weather data, translating environmental conditions into shifting sonic structures.",
          fullDescription:
            "Symmetrical Fictions is a generative sound work sculpted from temperature, humidity, and precipitation data. These inputs are mapped to frequency modulations, pitch deviations, and rhythmic bursts. The track extends the core of the Symmetrical Fictions project—an exploration of urban landscapes and unseen forces as performative systems. The result is ambient yet unstable, synthetic in texture but grounded in natural rhythms. A sonic architecture built on shifting skies and algorithmic interpretation.",
          medium: "Generative audio, environmental data mapping",
          technology: "TouchDesigner, environmental APIs, audio synthesis",
          themes: "Weather, systems, sonic translation, speculative environments",
          bandcampTracks: [
            {
              title: "symmetrical fictions",
              trackId: "520992353",
              url: "https://asymmetrica.bandcamp.com/track/symmetrical-fictions",
            },
          ],
        },
        {
          id: "asymmetrica-the-machine",
          title: "The Machine",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description:
            "An exploration of mechanized rhythms and synthetic textures embodying the essence of automated sound production.",
          fullDescription:
            "The Machine evokes industrial soundscapes with tight rhythmic patterns and digital noise, interrogating the relationship between human and machine in sound creation.",
          medium: "Digital audio, rhythm synthesis",
          technology: "DAW, Max/MSP, modular synthesis",
          themes: "Industrial aesthetics, mechanized rhythm, synthetic textures",
          bandcampTracks: [
            {
              title: "the machine",
              trackId: "73420518",
              url: "https://asymmetrica.bandcamp.com/track/the-machine",
            },
          ],
        },
        {
          id: "asymmetrica-the-overlap-a-fickle-thing",
          title: "The Overlap / A Fickle Thing",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Experimental track by asymmetrica.",
          fullDescription: "Exploring overlapping sonic textures.",
          medium: "Digital Audio",
          bandcampTracks: [
            {
              title: "the overlap / a fickle thing",
              trackId: "593874775",
              url: "https://asymmetrica.bandcamp.com/track/the-overlap-a-fickle-thing",
            },
          ],
        },
        {
          id: "asymmetrica-the-sauce",
          title: "The Sauce",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description: "Experimental track by asymmetrica.",
          fullDescription: "An experimental sonic exploration.",
          medium: "Digital Audio",
          bandcampTracks: [
            {
              title: "the sauce",
              trackId: "1297041022",
              url: "https://asymmetrica.bandcamp.com/track/the-sauce",
            },
          ],
        },
        {
          id: "asymmetrica-tiptoe",
          title: "Tiptoe",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          description:
            "A delicate balance of tension and subtle sonic shifts, tiptoeing between ambient textures and rhythmic pulses.",
          fullDescription:
            "Tiptoe navigates quiet spaces filled with fragile sound detail, exploring the interface between near silence and low-frequency movements. It's an experiment in minimalism and patience.",
          medium: "Digital audio, ambient synthesis",
          technology: "DAW, modular synth, field recording",
          themes: "Minimalism, ambient textures, tension and release",
          bandcampTracks: [
            {
              title: "tiptoe",
              trackId: "1726285270",
              url: "https://asymmetrica.bandcamp.com/track/tiptoe",
            },
          ],
        },
      ],

      // -------------------------------------------
      // PERFORMANCE
      // -------------------------------------------
      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          color: "cerulean",
          description:
            "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription:
            "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance. The gestures control everything from glitchy textures and drone tones to cinematic pulses and dynamic projections, all shaped by an ambient, meditative coding process rooted in presence and flow. It is not just a tool, but a responsive ecosystem—sensorial, poetic, and embodied.",
          medium:
            "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          tags: "INTERACTIVE • GESTURE • AUDIOVISUAL • SENSORIAL • REAL-TIME",
          technical: "MediaPipe, TouchDesigner, Python, real-time audio synthesis, custom control pipelines",
          themes:
            "Embodied computation, glitch aesthetics, subconscious interaction, ambient sound design, poetic control systems",
          images: ["./assets/images/fever-dream-performance.jpg", "./assets/images/fever-dream-performance-1.jpg"],
        },
        {
          id: "spaces-groningen",
          title: "Spaces @ OOST",
          category: "VJ • AMBIENT MUSIC • POETRY",
          color: "cerulean",
          description: "Ambient music and poetry event at the Ambient Room at Oost, Groningen.",
          fullDescription:
            "A collaborative event combining ambient soundscapes, poetry, and visual projections, designed to immerse attendees in a meditative, sensory environment. The event merges curated ambient music with live visuals, transforming the club space into a reflective, poetic experience. Performances explore the intersection of sound, text, and imagery, allowing the audience to drift between contemplation and subtle stimulation.",
          medium: "Live VJing, ambient music, poetry, audiovisual installation",
          tags: "LIVE • VJ • AMBIENT • POETRY • AUDIOVISUAL",
          technical: "Video projection, live music mixing, audiovisual sequencing",
          themes: "Immersive sound, ambient textures, poetic expression, club-based audiovisual experience",
          images: ["./assets/images/spaces.jpg", "./assets/images/spaces-1.jpg"],
        },
      ],

      // -------------------------------------------
      // INSTALLATIONS
      // -------------------------------------------
      installations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          category: "KINETIC & SONIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          description:
            "A 1.8-meter-tall kinetic sound sculpture with a slowly rotating 80 cm rain stick mounted on a raw wooden and steel armature.",
          fullDescription:
            "Rain Reminders is a meditative kinetic installation that reimagines the rain stick as a durational, healing sound object. At its center, a handmade 80 cm rain stick made with a PVC pipe, screws and filled with a mixture of mung beans and black rice, is rotated on its horizontal axis by a stepper motor, releasing a steady cascade of trickles that generate an unamplified texture reminiscent of rainfall.\nThe sculpture is built from coarse, industrial elements—steel square tubing, a 6x4 wood beam, exposed screws, and visible wiring. A coir mat rests beneath the frame.\nThe work emerged as a personal response to tinnitus, where the steady presence of this customised noise becomes a form of relief. In this context, the installation functions as a sonic prosthesis: a quiet companion producing persistent acoustic weather. Its sound is soft but continuous, mechanically repeated yet deeply calming—a form of meditative noise that both masks and soothes.",
          dimensions: "1.8m (height)",
          medium:
            "Motorized kinetic sculpture, acoustic rain stick, PVC pipe, screws, wood, steel, mung beans, black rice, exposed electronics",
          technical:
            "Custom low-RPM motor system, handmade 80 cm rain stick with internal grain cascade, steel and wood framework, coir matting",
          themes:
            "Tinnitus and White Noise, Acoustic Ritual and Duration, Provisional Construction, Meditative Distraction",
          images: [
            "./assets/images/rain-stick-6.JPG",
            "./assets/images/rain-stick-4.JPG",
            "./assets/images/rain-stick-2.JPG",
            "./assets/images/rain-stick-1.JPG",
          ],
          videos: ["./assets/video/rain-stick-video-1.mp4"],
        },
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          description:
            "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription:
            "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and fiction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets, the installation mirrors and tiles planetary surfaces creating impossible yet eerily coherent landscapes.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          tags: ["generative", "video", "research"],
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: [
            "./assets/images/39.jpg",
            "./assets/images/72.jpg",
            "./assets/images/73.jpg",
            "./assets/images/6.jpg",
          ],
          urls: {
            pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
          },
        },
      ],

      // -------------------------------------------
      // DRAWINGS & VISUAL WORK
      // Includes digital sketches and TouchDesigner tutorials
      // -------------------------------------------
      drawings: [
        // Visual Research & Sketches
        {
          id: "digital-sketches",
          title: "Digital Sketches + Visual Explorations",
          category: "VISUAL RESEARCH",
          color: "saffron",
          description:
            "A collection of digital drawings exploring geometric patterns, urban textures, and algorithmic aesthetics.",
          fullDescription:
            "These sketches serve as visual research for larger projects, exploring the intersection of traditional South Asian geometric patterns with contemporary digital aesthetics. They range from quick gestural studies to more developed compositions that inform installation and performance work.",
          medium: "Digital drawing, algorithmic pattern generation, mixed media",
          themes: "Geometric abstraction, urban textures, cultural pattern synthesis",
          tools: "TouchDesigner, generative algorithms",
          images: ["./assets/images/sketch1.jpg", "./assets/images/sketch2.png", "./assets/images/sketch3.png"],
        },
        {
          id: "old-drawings-sketchbook-series",
          title: "Old Digital+Analog Drawings",
          category: "ARCHIVE • PERSONAL WORK",
          color: "cerulean",
          description:
            "Early explorations in digital sketching and coloring using Autodesk SketchBook - studies of form, color, and imagination.",
          fullDescription:
            "These six drawings mark a formative period of digital creativity, made during an early engagement with Autodesk SketchBook. They reflect a phase of intuitive experimentation, where sketching and digital coloring were driven by curiosity, play, and a desire to shape inner visions. Though rough and spontaneous, these pieces represent personal milestones in visual expression and digital practice.",
          documentation: "Archived drawings from early digital sessions",
          medium: "Analog sketching and digital coloring",
          tags: ["digital", "sketches"],
          images: [
            "./assets/images/old drawing (1).jpg",
            "./assets/images/old drawing (2).jpg",
            "./assets/images/old drawing (3).jpg",
            "./assets/images/old drawing (4).jpg",
            "./assets/images/old drawing (6).jpg",
          ],
        },
        {
          id: "ritual-computing-solo-sessions",
          title: "Ritual Computing and Coding Sessions",
          category: "SOLO • RESEARCH-BASED",
          color: "electric-lime",
          description:
            "Solo sessions of meditative coding and sketching in TouchDesigner—private rituals of thought, structure, and experimentation.",
          fullDescription:
            "These sessions are personal, introspective rituals where code becomes a tool for artistic inquiry and self-reflection. They are not participatory performances but private explorations—into the aesthetics of computation, the poetics of systems, and the possibilities of AI as a creative collaborator. Through repeated practice, I engage with code as both medium and method, researching form, structure, and the intersection of technology with artistic process.",
          documentation: "In-progress sketches and logs",
          medium: "Code sketching, procedural visuals, AI collaboration",
          tags: ["generative", "code", "research"],
          images: [
            "./assets/images/ritual-computing-1.png",
            "./assets/images/ritual-computing-2.png",
            "./assets/images/ritual-computing-3.jpg",
          ],
        },

        // TouchDesigner Tutorials (sorted alphabetically by title)
        {
          id: "audiodevout-video-1",
          title: "AudioReactive Text with Tracing and Instancing - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description:
            "Learn how to create audioreactive text with tracing and instancing techniques in TouchDesigner.",
          fullDescription:
            "A comprehensive tutorial exploring audioreactive text generation using tracing and instancing methods in TouchDesigner for dynamic visual performances.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/Di4fRVElkro"],
        },
        {
          id: "audiodevout-audioreactive-text-showcase",
          title: "Audioreactive Text in TouchDesigner - Project Showcase",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "A snippet of an audioreactive text project used in a recent VJ performance.",
          fullDescription:
            "Showcasing an audioreactive text visualization built in TouchDesigner, demonstrating dynamic text effects synced to audio input. Project files are available on Patreon.",
          medium: "TouchDesigner, audioreactive visuals",
          tags: ["TouchDesigner", "audioreactive", "text", "VJ", "performance"],
          videos: ["https://www.youtube.com/watch?v=GlMgtr-ejzs"],
        },
        {
          id: "audiodevout-video-5",
          title: "Audioreactive ParticlesGPU in TouchDesigner (with AudioAnalysis)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Building audioreactive particle systems with audio analysis integration.",
          fullDescription:
            "Comprehensive tutorial on creating audioreactive particle systems using ParticlesGPU and audio analysis tools in TouchDesigner.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/u5JXHaGVywI"],
        },
        {
          id: "audiodevout-controlled-feedback-cache-tops",
          title: "Controlled Feedback with Cache TOPs in TouchDesigner",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Tutorial on controlling feedback trails using the Cache TOP in TouchDesigner.",
          fullDescription:
            "Learn how to manage and control feedback effects in TouchDesigner using Cache TOPs for more precise visual trails and effects. Project files available on Patreon.",
          medium: "TouchDesigner, visual effects, feedback control",
          tags: ["TouchDesigner", "feedback", "Cache TOP", "tutorial", "visual effects"],
          videos: ["https://www.youtube.com/watch?v=TXbIgtYaNqQ"],
        },
        {
          id: "audiodevout-video-4",
          title: "Force Fields and Mouse Inputs with ParticlesGPU - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Interactive particle systems controlled by force fields and mouse input.",
          fullDescription:
            "Learn how to create interactive particle systems using ParticlesGPU with force field dynamics and mouse-driven controls in TouchDesigner.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/uusZcyW7o9Q"],
        },
        {
          id: "audiodevout-instancing-to-midi",
          title: "Interactive Instrument – Instancing to MIDI in TouchDesigner",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description:
            "Use RenderPick CHOP to extract instancing data and convert clicks into MIDI — click to play in TouchDesigner.",
          fullDescription:
            "In this tutorial, audiodevout demonstrates a special interactive project that uses TouchDesigner's RenderPick CHOP to capture instancing data and translate it into MIDI notes, allowing clickable visual geometry to play sound. A clean, high-performance demo of touch-mapped MIDI instancing.",
          medium: "TouchDesigner, interactive generative visuals, MIDI integration",
          tags: ["TouchDesigner", "instancing", "RenderPick CHOP", "MIDI", "interactive", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=Qrtwn5XjDzk"],
        },
        {
          id: "audiodevout-kaleidoscopic-fractals-particlesgpu",
          title: "Kaleidoscopic Fractals with ParticlesGPU in TouchDesigner - Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Create fractal patterns using ParticlesGPU with tiling, mirroring, and feedback loops.",
          fullDescription:
            "Explore fractal generation techniques in TouchDesigner combining ParticlesGPU, tiling and mirroring operators, and feedback loops to create stunning kaleidoscopic visuals.",
          medium: "TouchDesigner, particle systems, generative art",
          tags: ["TouchDesigner", "ParticlesGPU", "fractals", "generative art", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=TUOnPUHWpIU"],
        },
        {
          id: "audiodevout-video-2",
          title: "Noise Sculpting in TouchDesigner (Part 8) - Abstract Particle Structures",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Advanced noise sculpting techniques for creating abstract particle structures.",
          fullDescription:
            "Part 8 of the noise sculpting series, focusing on building complex abstract particle structures using advanced noise manipulation in TouchDesigner.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/uSVB-EnoRkk"],
        },
        {
          id: "audiodevout-video-3",
          title: "Noise Sculpting with TouchDesigner (Part 7) - Ghostly Particles",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Creating ethereal, ghostly particle effects using noise sculpting.",
          fullDescription:
            "Part 7 of the noise sculpting series, demonstrating how to create haunting, ghostly particle effects through noise manipulation techniques.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/4GkBT_fUNOM"],
        },
        {
          id: "audiodevout-noise-sculpting-part3",
          title: "Noise Sculpting in TouchDesigner – Part 3",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Continuing the series, exploring procedural noise sculpting techniques in TD.",
          fullDescription:
            "In this installment of audiodevout's Noise Sculpting series, dive into advanced noise manipulation workflows in TouchDesigner to produce evolving textures and structures.",
          medium: "TouchDesigner, generative visuals",
          tags: ["TouchDesigner", "noise sculpting", "tutorial", "generative art"],
          videos: ["https://www.youtube.com/watch?v=Mu1TpRVujuY"],
        },
        {
          id: "audiodevout-noise-sculpting-part4",
          title: "Noise Sculpting in TouchDesigner – Part 4",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Further exploration of noisy geometry manipulation techniques.",
          fullDescription:
            "In Part 4, audiodevout continues to sculpt geometry with noise and compositing in TouchDesigner, refining structure and color interactions.",
          medium: "TouchDesigner, procedural geometry",
          tags: ["noise sculpting", "geometry", "TouchDesigner", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=s8ea30HlTHE"],
        },
        {
          id: "audiodevout-noise-sculpting-part6-radial-lighting",
          title: "Noise Sculpting Part 6 - Radial Lighting",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Abstract structure using geo instancing with circular lighting and shadows.",
          fullDescription:
            "Techniques for building abstract 3D structures using geometry instancing and introducing radial lighting effects with circular ramps and compositing modes in TouchDesigner.",
          medium: "TouchDesigner, 3D geometry, lighting",
          tags: ["TouchDesigner", "noise sculpting", "instancing", "lighting", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=mkVa8D8_FIw"],
        },
        {
          id: "audiodevout-particlesgpu-noise-sculpting",
          title: "Noise Sculpting in TouchDesigner with ParticlesGPU",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Leveraging ParticlesGPU for realtime noise-driven particle visuals.",
          fullDescription:
            "In this tutorial, audiodevout combines the Noise Sculpting series with the ParticlesGPU TOP in TouchDesigner, building reactive, particle-based generative visuals.",
          medium: "TouchDesigner, particle systems",
          tags: ["ParticlesGPU", "noise sculpting", "generative visuals", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=kcZH2zcHANc"],
        },
        {
          id: "audiodevout-particle-structures-mesh-generator",
          title: "Particle Structures with Mesh Generator - Noise Sculpting Part 6",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Using Mesh Generator and operator techniques to create spiral particle structures.",
          fullDescription:
            "This project uses the Mesh Generator tool combined with operator tricks in TouchDesigner to produce cool spiral particle structures. Files available for Patreon members.",
          medium: "TouchDesigner, mesh generation, particle systems",
          tags: ["TouchDesigner", "Mesh Generator", "particles", "spiral", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=XHGeICkx9lU"],
        },
        {
          id: "audiodevout-prime-spiral-visualizer",
          title: "Prime Spiral Visualizer – TouchDesigner .tox Component",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description:
            "Real-time TouchDesigner visualizer inspired by prime exponential sums and Veritasium's Goldbach video.",
          fullDescription:
            "A complex exponential sum visualization over primes, inspired by Hardy, Littlewood, Ramanujan, and Veritasium's $1,000,000 Goldbach Conjecture video. Includes controls for prime count, modulation angle, animation toggle, and more.",
          medium: "TouchDesigner, generative visuals",
          tags: ["TouchDesigner", "visualizer", "primes", "generative", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=a6lC3tAVilo"],
        },
        {
          id: "audiodevout-quick-emboss-filter",
          title: "Quick Emboss Filter for TouchDesigner (FREE COMPONENT FILE)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "A quick emboss filter tutorial with free component download for TouchDesigner users.",
          fullDescription:
            "Demonstrates how to create a quick emboss filter effect in TouchDesigner with project files and tox component freely available on Patreon.",
          medium: "TouchDesigner, visual effects",
          tags: ["TouchDesigner", "emboss filter", "free component", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=CelbrPlWM_k"],
        },
        {
          id: "audiodevout-replicator-limit-feedback",
          title: "Replicator-Limit-Feedback (Project Overview)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Short overview of a replicator feedback project with Patreon support request.",
          fullDescription:
            "An introduction and brief overview of the Replicator-Limit-Feedback project with links to Patreon support and future tutorial plans involving Ableton and TouchDesigner.",
          medium: "TouchDesigner, generative visuals",
          tags: ["TouchDesigner", "feedback", "replicator", "project overview"],
          videos: ["https://www.youtube.com/watch?v=IR0T0t49gnw"],
        },
        {
          id: "audiodevout-simple-grid-patterns",
          title: "Simple Grid Patterns with TouchDesigner (Tutorial)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Creating simple grid-based visual patterns in TouchDesigner.",
          fullDescription:
            "A straightforward tutorial for building simple grid patterns in TouchDesigner to help beginners understand basic layout and pattern creation.",
          medium: "TouchDesigner, pattern design",
          tags: ["TouchDesigner", "grid patterns", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=TbRtV"],
        },
        {
          id: "audiodevout-video-6",
          title: "Vibing with ParticlesGPU in TouchDesigner",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Exploring creative particle effects and vibes with ParticlesGPU.",
          fullDescription:
            "A creative exploration of ParticlesGPU capabilities in TouchDesigner, focusing on aesthetic particle effects and visual vibes.",
          medium: "TouchDesigner, generative visuals",
          videos: ["https://youtu.be/jFzNeCwaeEM"],
        },
      ],

      // -------------------------------------------
      // WRITING & RESEARCH
      // Academic papers and research projects
      // -------------------------------------------
      writing: [
        {
          id: "post-television-audiences",
          title: "Post-Television Audiences on YouTube: Production and Consumption in the Digital Public Sphere",
          category: "RESEARCH & WRITING",
          color: "crimson",
          description:
            "A research paper analyzing how YouTube reshapes audience participation, blurs boundaries between consumers and producers, and transforms cultural discourse in the digital public sphere.",
          fullDescription:
            "Post-Television Audiences on YouTube is a research project examining the decline of traditional television audiences and the rise of participatory media consumption through YouTube. Drawing on Habermas' concept of the public sphere and Dahlgren's digital public sphere framework, the study highlights how YouTube enables new forms of democratic interaction, prosumer behavior, and niche cultural communities while embedding itself within corporate structures. By contrasting television's centralized, passive reception with YouTube's interactive, decentralized dynamics, the research argues that the digital public sphere redefines representation, cultural participation, and the production of meaning.",
          medium: "Research paper, digital media studies, cultural theory",
          tags: ["digital media", "YouTube", "audience studies", "public sphere", "prosumer culture"],
          themes: "Democratization of media, prosumer culture, audience autonomy, corporate control, digital commons",
          urls: {
            pdf: "./assets/documents/aps-paper.pdf",
          },
        },
        {
          id: "transcending-identities",
          title: "Transcending Identities: Gender Performance and Psychedelic Trance in Goa's Rave Scene",
          category: "RESEARCH & WRITING",
          color: "violet",
          description:
            "An ethnographic study exploring how underground psytrance festivals act as transformative spaces for (masculine) gender identity, technology-mediated performance, and collective self-expression.",
          fullDescription:
            "Transcending Identities is a research project examining the underground rave scene as a site of gender performance, transformation, and collective liberation. Using the case study of Karacus Maracus 2021, a psychedelic trance festival in Goa, the study investigates how sound, technology, and dance interact to destabilize traditional gender binaries. Drawing from Maria Pini's frameworks on cyborgs and nomads, the research highlights how rave environments subvert normative masculinity, enabling new modes of self-expression, collective desire, and embodied politics to emerge through improvisational choreographies and trance states.",
          medium: "Ethnographic research, festival case study, electronic music culture",
          tags: ["rave", "gender", "psytrance", "ethnography", "musicology"],
          themes: "Gender fluidity, collective identity, trance states, techno-primitivism, embodied politics",
          urls: {
            pdf: "./assets/documents/gspm-paper.pdf",
          },
        },
      ],
    },

    // ===========================================
    // EXHIBITIONS
    // Sorted chronologically (most recent first)
    // ===========================================
    exhibitions: [
      {
        id: "ectlab5-symmetrical-fictions",
        title: "5th European Culture and Technology Lab+ Annual Conference",
        date: "November 2025",
        description:
          "Presented the talk 'Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation' as part of the fifth ECT Lab+ conference, focusing on the relationships between technological culture, contemporary art, and speculative research.",
        location: "Eindhoven, NL",
        role: "Talk/Presentation",
        venue: "Baltan Laboratories",
        images: ["./assets/images/ect5.png"],
        urls: {
          link: "https://www.baltanlaboratories.org/events/5th-european-culture-and-technology-lab-annual-conference",
          pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
        },
        videos: ["./assets/video/ect5-1.mp4"],
      },
      {
        id: "urban-arts-tour",
        title: "Urban Arts Tour: Extended Living Room",
        date: "November 2025",
        description:
          "Part of the Urban Arts Tour, 'Extended Living Room' transformed public spaces into interactive art zones. The featured work, 'Rain Reminders', was a kinetic sculpture that responded to environmental changes, engaging passersby in a playful dialogue between city life and natural patterns.",
        location: "Groningen, NL",
        role: "Kinetic Sculpture",
        venue: "Nieuwe Markt/Forum",
        images: [
          "./assets/images/rain-stick-6.JPG",
          "./assets/images/rain-stick-5.JPG",
          "./assets/images/rain-stick-4.JPG",
        ],
        urls: {
          link: "https://forum.nl/nl/agenda/talks-events/urban-arts-tour-extended-living-room",
        },
        videos: ["./assets/video/rain-stick-video-1.mp4"],
      },
      {
        id: "nervous-systems-kel30",
        title: "Nervous Systems",
        date: "June 2025",
        description:
          "This exhibition explored the interplay between human perception and reactive environments. 'Rain Reminders', my kinetic sculpture, was presented as a dynamic installation, highlighting the subtle feedback between human interaction and automated motion within the space.",
        location: "Haren, NL",
        role: "Kinetic Sculpture",
        venue: "KEL-30",
        images: ["./assets/images/nervous-system-1.jpg"],
        urls: {
          instagram: "https://www.instagram.com/p/DLAl1LYsGLo/",
        },
      },
      {
        id: "fever-dream-minerva",
        title: "Fever Dream",
        date: "May 2025",
        description:
          "'Fever Dream' showcased experimental audiovisual performances. I presented a gesture-controlled generative system that transformed performers' movements into immersive audiovisual experiences, creating a responsive environment that blurred the line between performer and installation.",
        location: "Groningen, NL",
        role: "AV Performance",
        venue: "Minerva Academy",
        images: ["./assets/images/fever-dream-poster.jpg"],
        videos: ["https://www.youtube.com/watch?v=sSkNm3GcGq8"],
      },
      {
        id: "contemporary-art-lecture",
        title: "On Contemporary Art and Artistic Practice in The Netherlands and Western Europe",
        date: "February 2025",
        description:
          "Delivered a lecture examining contemporary art practices across the Netherlands and Western Europe. Discussed evolving artistic strategies, interdisciplinary collaborations, and presented examples of my own work to illustrate the intersection of technology, performance, and public engagement.",
        location: "Ajmer, IN",
        role: "Lecture/Presentation",
        venue: "Government Girls College",
      },
    ],

    // ===========================================
    // CONTACT & ABOUT
    // ===========================================
    contact: {
      about: {
        title: "ABOUT ME",
        description: `I am an artist and researcher working at the intersection of sound, technology, and space. My practice spans kinetic sculpture, audiovisual performance, generative systems, and research-driven writing, with computational processes serving as both medium and method. I treat sound and code as materials for constructing contemplative and surreal experiences, drawing on noise, entropy, and asymmetry to reimagine how we listen, perceive, and engage with digital systems.

Across installations, performances, and academic inquiry, I explore the shifting boundaries between organic and synthetic, rational and intuitive, individual and collective. Ritual, memory, and healing often surface as themes, whether through transforming environmental data into generative soundscapes, designing embodied tools for performance, or composing speculative environments. Grounded in experimental sound practice, creative coding, and critical research, my work questions techno-positivist narratives while opening spaces for reflection, presence, and poetic engagement with technology.`,
        credentials: ["Sound Art", "Kinetic Sculpture", "AudioVisual Performance", "TouchDesigner Tutorials"],
        image: "./assets/images/atharva.jpeg",
      },

      cv: {
        education: [
          {
            degree: "Master of Arts (MA), Fine Arts (Media, Art, Design and Technology)",
            institution: "Frank Mohr Institute, Minerva Academy, Hanze University of Applied Sciences",
            location: "Groningen, NL",
            period: "Sep 2024 – Aug 2026",
          },
          {
            degree: "Master of Arts (MA), Arts and Culture (Arts, Cognition and Criticism)",
            institution: "University of Groningen",
            location: "Groningen, NL",
            period: "Sep 2022 – Aug. 2023",
          },
          {
            degree: "Bachelor of Arts (Triple Major: Psychology, Sociology and Literature)",
            institution: "Christ University",
            location: "Bangalore, IN",
            period: "Aug 2017 – Jun 2020",
          },
        ],
        skills: {
          general: [
            "Art Research",
            "Art Education",
            "New Media Art",
            "Cultural Research",
            "Interactive Media",
            "Creative Concept Design",
            "Sound Design",
            "VJing",
            "DJing",
          ],
          interests: ["Interactive Audiovisual Installations", "Workshops", "Digital Art", "Generative AV"],
          technologies: ["TouchDesigner", "Ableton Live", "Arduino IDE", "Web UI", "Python"],
        },
        workExperience: [
          {
            title: "Freelance Art Producer",
            company: "Art Researcher and Educator",
            location: "Groningen, NL",
            period: "Oct. 2023 - Present",
            responsibilities: [
              "TouchDesigner tutorials on YouTube @audiodevout",
              "Music production and sound design @asymmetrica",
              "Visual Jockey (VJ)",
              "Sound Design for Art Installations",
              "Creative Coding Workshops",
            ],
          },
          {
            title: "Research and Development Intern",
            company: "Broedplaats De Campagne",
            location: "Groningen, NL",
            period: "Feb. 2023 – Oct. 2023",
            responsibilities: [
              "Worked on large-scale art installations under Artist and Theatre Professional Chantalla Pleiter.",
              "Contributed to the creation and presentation of 4 different projects related to XR technologies and sound design at festivals like Noorderzon Performing Arts Festival and Expeditie Next.",
            ],
          },
          {
            title: "Research Assistant",
            company: "University of Groningen",
            location: "Groningen, NL",
            period: "Oct. 2022 – Aug. 2023",
            responsibilities: [
              "Research assistant for the project 'Listen Here Now' - A study into the urban soundscapes of Groningen by Rudolf Agricola School of Sustainable Development",
              "Oversaw core project responsibilities, participant communication, logistics, and marketing. Also including audio-visual logistics, procurement, and maintenance of equipment.",
            ],
          },
        ],
      },

      description: "I love to talk about stuff!",

      social: [
        {
          color: "saffron",
          icon: "bandcamp",
          name: "Bandcamp",
          url: "https://asymmetrica.bandcamp.com/",
        },
        {
          color: "neon-magenta",
          icon: "instagram",
          name: "Instagram (Personal)",
          url: "https://www.instagram.com/asymmetrica_/",
        },
        {
          color: "electric-lime",
          icon: "instagram",
          name: "Instagram (Art)",
          url: "https://www.instagram.com/audiodevout/",
        },
        {
          color: "cerulean",
          icon: "linkedin",
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/atharva--gupta/",
        },
        {
          color: "electric-lime",
          icon: "patreon",
          name: "Patreon",
          url: "https://www.patreon.com/audiodevout",
        },
        {
          color: "cerulean",
          icon: "youtube",
          name: "YouTube",
          url: "https://www.youtube.com/@audiodevout",
        },
      ],
    },

    // ===========================================
    // PAGE CONTENT
    // ===========================================
    pageContent: {
      home: {
        title: "Experimental Systems",
        subtitle: "by Atharva Gupta",
        description:
          "Exploring the intersection of technology, sound, and space through installation, performance, and research.",
      },
    },
  }

  // Make data available globally with error handling
  if (typeof window !== "undefined") {
    window.portfolioData = portfolioData
    console.log("Portfolio data loaded successfully")
  }
} catch (error) {
  console.error("Error loading portfolio data:", error)

  // Fallback data structure
  if (typeof window !== "undefined") {
    window.portfolioData = {
      projects: {
        drawings: [],
        installations: [],
        performance: [],
        soundInstallations: [],
        writing: [],
      },
      exhibitions: [],
      contact: {
        description: "Portfolio data failed to load. Please refresh the page.",
        social: [],
      },
      pageContent: {
        home: {
          title: "Experimental Systems",
          subtitle: "Loading Error",
          description: "Please refresh the page.",
        },
      },
    }
  }
}
