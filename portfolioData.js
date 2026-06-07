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
          id: "asymmetrica-minus-12-c",
          title: "-12° C",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "glacier",
          description: "Cold, restrained electronic composition shaped by sparse motion.",
          fullDescription:
            "-12° C maintains a reduced palette, favouring brittle textures, low-energy movement, and extended silences between events. The track is structured around restraint, with sounds appearing isolated and exposed rather than layered. Its pacing and tonal temperature suggest an environment where energy is conserved and every action carries weight.",
          medium: "Digital audio, sparse electronic composition",
          technology: "Ableton Live, restrained synthesis, minimal sequencing, spatial reverb",
          themes: "coldness, restraint, isolation, minimal motion, sonic economy",
          bandcampTracks: [
            {
              title: "-12° C",
              trackId: "1009465888",
              url: "https://asymmetrica.bandcamp.com/track/12-c",
            },
          ],
        }
        ,
                {
          id: "asymmetrica-impulse",
          title: "Impulse",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "crimson",
          description: "Short-form rhythmic study centred on attack and immediacy.",
          fullDescription:
            "Impulse is built from sharp transient events and tightly gated signals, foregrounding attack as the primary compositional material. The piece avoids development in favour of insistence, pushing a small set of gestures through rapid repetition and abrupt interruption. The result is a compact, physical track that reads more as signal behaviour than song structure.",
          medium: "Digital audio, transient-focused composition",
          technology: "Ableton Live, envelope shaping, transient control, rhythmic gating",
          themes: "attack, immediacy, signal behaviour, repetition, interruption",
          bandcampTracks: [
            {
              title: "impulse",
              trackId: "2193793800",
              url: "https://asymmetrica.bandcamp.com/track/impulse",
            },
          ],
        },

        {
          id: "asymmetrica-sublimatic",
          title: "Sublimatic",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "violet",
          description: "Minimalist electronic structure driven by gradual transformation.",
          fullDescription:
            "Sublimatic unfolds slowly, prioritising temporal stretch over event density. Small shifts in timbre, modulation depth, and spatial placement accumulate across the duration, producing a perceptual drift rather than narrative progression. The track functions as a listening environment, asking attention to recalibrate to subtle changes rather than explicit musical gestures.",
          medium: "Digital audio, minimal composition, slow modulation systems",
          technology: "Ableton Live, long-form automation, subtractive synthesis, spatial effects",
          themes: "gradual change, duration, minimalism, perception, sonic environment",
          bandcampTracks: [
            {
              title: "sublimatic",
              trackId: "2633361304",
              url: "https://asymmetrica.bandcamp.com/track/sublimatic",
            },
          ],
        },


                {
          id: "asymmetrica-the-sauce",
          title: "The Sauce",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "amber",
          description: "Rhythmic distortion study built around pressure, repetition, and release.",
          fullDescription:
            "The Sauce operates as a compressed loop ecology, where distorted percussive gestures fold back onto themselves through tight timing and aggressive filtering. The track leans on repetition as a stress mechanism, gradually thickening its own texture through saturation, micro-variation, and controlled overload. What emerges is a functional groove that feels constantly on the verge of destabilising, yet never fully breaks.",
          medium: "Digital audio, loop-based composition, distortion processing",
          technology: "Ableton Live, audio effects chains, saturation, filtering, rhythmic automation",
          themes: "pressure, repetition, groove collapse, texture, rhythmic insistence",
          bandcampTracks: [
            {
              title: "the sauce",
              trackId: "1297041022",
              url: "https://asymmetrica.bandcamp.com/track/the-sauce",
            },
          ],
        },

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
            "Generative audio from live weather data (temperature, humidity, precipitation), mapped to pitch, modulation, and rhythm—ambient but unstable, synthetic timbres tied to shifting outdoor conditions.",
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
            "MediaPipe and TouchDesigner map body movement to real-time sound and generative visuals. First shown at Fever Dream; since then it has served as a modular live A/V platform—gestures drive glitch and drone textures, pulses, and projections—with an intentionally slow, embodied approach to control and coding.",
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
            "One night at Ambient Room, Oost: live ambient sets, poetry, and VJ work in the same room—sound, text, and image kept deliberately slow and sensory.",
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
          id: "instruments-for-becoming",
          title: "Instruments for Becoming",
          category: "KINETIC SCULPTURE • SONIC OBJECTS • MOTOR SYSTEMS",
          color: "saffron",
          description:
            "Two related kinetic installations: Rain Reminders—a 1.8 m rotating rain stick sculpture—and Spinny Sticks—suspended motor-driven drawing and tension instruments.",
          fullDescription:
            "Rain Reminders — A motorized rain stick (PVC, mung beans and black rice) rotated on a horizontal axis: a soft, unamplified rainfall texture. Steel, wood beam, exposed wiring, coir mat below. Developed partly in response to tinnitus—the steady grain acts as a kind of sonic prosthesis: persistent “weather” that masks and calms.\n\nSpinny Sticks — Hanging rotary assemblies of rods, pencils, and tensioned thread, each driven by a low-speed motor. Pencils mark surfaces under strain; threads fatigue slowly. The system stays off-balance—small differences in load and wear add up to divergent motion, creaks, and friction. Tension is treated as a condition, not a fault: closer to a nervous system than a clock.",
          dimensions:
            "Rain Reminders: 1.8 m (height). Spinny Sticks: variable installation, individual units approx. 40–80 cm diameter",
          medium:
            "Motorized kinetic sculpture, acoustic rain stick, PVC, wood, steel, grains, exposed electronics; motorized kinetic drawing instruments, pencils, thread, metal rods, weights, motors, power supplies",
          technical:
            "Custom low-RPM motor systems, handmade 80 cm rain stick with internal grain cascade, steel and wood framework, coir matting; low-RPM DC motor systems, custom rotary assemblies, tensioned filament networks, suspended mounting system",
          themes:
            "Tinnitus and acoustic ritual, tension and unstable systems, mechanical fatigue, drawing as duration, meditative noise",
          images: [
            "./assets/images/rain-stick-1.JPG",
            "./assets/images/rain-stick-2.JPG",
            "./assets/images/rain-stick-4.jpg",
            "./assets/images/rain-stick-6.jpg",
            "./assets/images/spinny-sticks-1.png",
            "./assets/images/spinny-sticks-2.png"
          ],
          videos: ["./assets/video/rain-stick-video-1.mp4", "https://youtu.be/SWMkYxuWrNE"],
        },


        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          description:
            "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription:
            "Satellite tiles are mirrored and recomposed into speculative, symmetrical landscapes—coherent yet impossible terrain that sits between rational cartography, fiction, and unconscious visual patterning.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          tags: ["generative", "video", "research"],
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: [
            "./assets/images/6.jpg",
            "./assets/images/39.jpg",
            "./assets/images/72.jpg",
            "./assets/images/73.jpg"
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
          id: "digital-sketch-01",
          title: "Surveillance",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: ["./assets/images/sketch1.jpg"],
        },
        {
          id: "digital-sketch-02",
          title: "Oost - October 2024",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: ["./assets/images/sketch2.png"],
        },
        {
          id: "digital-sketch-03",
          title: "Flow",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: ["./assets/images/sketch3.png"],
        },
        
        {
          id: "ritual-computing-01",
          title: "Noise Sculpting - 1",
          category: "VISUAL RESEARCH",
          color: "electric-lime",
          images: ["./assets/images/ritual-computing-1.png"],
        },
        {
          id: "ritual-computing-02",
          title: "Noise Sculpting - 2",
          category: "VISUAL RESEARCH",
          color: "electric-lime",
          images: [
            "./assets/images/ritual-computing-2.png",
            "./assets/images/diamonddoodles.15.png",
            "./assets/images/diamonddoodles.16.png",
            "./assets/images/diamonddoodles.17.png",
            "./assets/images/diamonddoodles.18.png",
            "./assets/images/diamonddoodles.19.png",
            "./assets/images/diamonddoodles.20.png",
            "./assets/images/diamonddoodles.21.png",
            "./assets/images/diamonddoodles.22.png",
            "./assets/images/diamonddoodles.23.png",
            "./assets/images/diamonddoodles.24.png",
            "./assets/images/diamonddoodles.25.png",
            "./assets/images/diamonddoodles.26.png",
            "./assets/images/diamonddoodles.27.png",
            "./assets/images/diamonddoodles.28.png",
          ],
        },
        {
          id: "ritual-computing-03",
          title: "Noise Sculpting - 3",
          category: "VISUAL RESEARCH",
          color: "electric-lime",
          images: ["./assets/images/ritual-computing-3.jpg"],
        },

        {
          id: "superboxes-01",
          title: "Superboxes",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/superboxex.0.jpg",
            "./assets/images/superboxex.1.jpg",
            "./assets/images/superboxex.2.jpg",
            "./assets/images/superboxex.3.jpg",
            "./assets/images/superboxes.0.jpg",
            "./assets/images/superboxes.2.jpg",
            "./assets/images/superboxes.3.jpg",
            "./assets/images/superboxes.4.jpg",
            "./assets/images/superboxes.5.jpg",
            "./assets/images/superboxes.6.jpg",
            "./assets/images/sprbxes.0.jpg",
            "./assets/images/sprbxes.1.jpg",
            "./assets/images/sprbxes.2.jpg",
            "./assets/images/sprbxes.3.jpg",
            "./assets/images/sprbxes.4.jpg",
            "./assets/images/sprbxes.5.jpg",
            "./assets/images/sprbxes.6.jpg",
            "./assets/images/sprbxes.7.jpg",
            "./assets/images/sprbxes.8.jpg",
            "./assets/images/sprbxes.10.jpg",
            "./assets/images/sprbxes.12.jpg"
          ],
        },

        {
          id: "riso-mono-test-01",
          title: "Packing Tests",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/riso mono export test - 1 -.0.jpg",
            "./assets/images/riso mono export test - 1 -.1.jpg",
            "./assets/images/riso mono export test - 1 -.2.jpg",
            "./assets/images/riso mono export test - 1 -.3.jpg",
            "./assets/images/riso mono export test - 1 -.4.jpg",
            "./assets/images/riso mono export test - 1 -.5.jpg",
            "./assets/images/riso mono export test - 1 -.6.jpg",
            "./assets/images/riso mono export test - 1 -.7.jpg",
            "./assets/images/riso mono export test - 1 -.102.jpg",
            "./assets/images/riso mono export test - 1 -.103.jpg",
            "./assets/images/riso mono export test - 1 -.104.jpg",
            "./assets/images/riso mono export test - 1 -.105.jpg"
          ],
        },
        {
          id: "feedback-worms-02",
          title: "Feedback Worms",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/feedback worms.0.png",
            "./assets/images/feedback worms.1.png",
            "./assets/images/feedback worms.2.png",
            "./assets/images/feedback worms.3.png",
            "./assets/images/feedback worms.4.png",
            "./assets/images/feedback worms.5.png",
            "./assets/images/feedback worms.6.png",
            "./assets/images/feedback worms.7.png",
            "./assets/images/feedback worms.8.png",
            "./assets/images/feedback worms.9.png",
           
            
          ],
        },
        {
          id: "abstract-sculpture-series-01",
          title: "Abstract Sculpture Series",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/abstract_sculpture_series.0.jpg",
            "./assets/images/abstract_sculpture_series.1.jpg",
            "./assets/images/abstract_sculpture_series.2.jpg",
            "./assets/images/abstract_sculpture_series.3.jpg",
            "./assets/images/abstract_sculpture_series.4.jpg",
            "./assets/images/abstract_sculpture_series.5.jpg",
            "./assets/images/abstract_sculpture_series.6.jpg",
            "./assets/images/abstract_sculpture_series.7.jpg",
            "./assets/images/abstract_sculpture_series.8.jpg",
            "./assets/images/abstract_sculpture_series.9.jpg",
            "./assets/images/abstract_sculpture_series.10.jpg",
            
          ],
        },
        {
          id: "magical-wells-01",
          title: "Magical Wells",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/TDMovieOut.3.png",
            "./assets/images/TDMovieOut.4.png",
            "./assets/images/TDMovieOut.9.png",
            "./assets/images/TDMovieOut.13.png",
            "./assets/images/TDMovieOut.14.png",
          ],
        },
        {
          id: "morsecode-export-12",
          title: "Noise Sculpting 3",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: ["./assets/images/morsecode_exports.12.jpg"],
        },

        
        {
          id: "asymmetrica-face-01",
          title: "asymmetrica face",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/asymmetrica face.0.jpg",
            "./assets/images/asymmetrica face.1.jpg",
            "./assets/images/asymmetrica face.2.jpg",
            "./assets/images/asymmetrica face.3.jpg",
            "./assets/images/asymmetrica face.4.jpg",
            "./assets/images/asymmetrica face.5.jpg",
          ],
        },
        {
          id: "flow-series-01",
          title: "flow",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/flow.0.jpg",
            "./assets/images/flow.1.jpg",
            "./assets/images/flow.2.jpg",
            "./assets/images/flow.3.jpg",
          ],
        },
        {
          id: "heat-divinity-01",
          title: "heatdivinity",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/heatdivinitee.jpg",
            "./assets/images/heatdivinity.jpg",
            "./assets/images/heatdivinity2.jpg",
          ],
        },
        {
          id: "moire-play-01",
          title: "moire play",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/moire play.0.jpg",
            "./assets/images/moire play.1.jpg",
            "./assets/images/moire play.2.jpg",
            "./assets/images/moire play.3.jpg",
          ],
        },
        {
          id: "myceliumaudio-01",
          title: "myceliumaudio",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/myceliumaudio.0.jpg",
            "./assets/images/myceliumaudio.1.jpg",
            "./assets/images/myceliumaudio.2.jpg",
            "./assets/images/myceliumaudio.3.jpg",
            "./assets/images/myceliumaudio.4.jpg",
            "./assets/images/myceliumaudio.5.jpg",
            "./assets/images/myceliumaudio.6.jpg",
            "./assets/images/myceliumaudio.7.jpg",
            "./assets/images/myceliumaudio.8.jpg",
            "./assets/images/myceliumaudio.9.jpg",
            "./assets/images/myceliumaudio.10.jpg",
            "./assets/images/myceliumaudio.11.jpg",
            "./assets/images/myceliumaudio.12.jpg",
          ],
        },
        {
          id: "noise-between-the-lines-01",
          title: "noise between the lines",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/noise between the lines.0.jpg",
            "./assets/images/noise between the lines.1.jpg",
            "./assets/images/noise between the lines.2.jpg",
            "./assets/images/noise between the lines.3.jpg",
            "./assets/images/noise between the lines.4.jpg",
            "./assets/images/noise between the lines.5.jpg",
          ],
        },
        {
          id: "noisepattern-01",
          title: "noisepattern",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/noisepattern.0.jpg",
            "./assets/images/noisepattern.1.jpg",
            "./assets/images/noisepattern.2.jpg",
            "./assets/images/noisepattern.3.jpg",
            "./assets/images/noisepatternexp.0.jpg",
            "./assets/images/noisepatternexp.1.jpg",
            "./assets/images/noisepatternexp.2.jpg",
            "./assets/images/noisepatternexp.3.jpg",
            "./assets/images/noisepatternexp.4.jpg",
            "./assets/images/noisepatternexp.5.jpg",
            "./assets/images/noisepatternexp.6.jpg",
            "./assets/images/noisepattexrnexp.5.jpg",
          ],
        },
        {
          id: "old-drawings-01",
          title: "old drawings",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/old drawing (1).jpg",
            "./assets/images/old drawing (2).jpg",
            "./assets/images/old drawing (3).jpg",
            "./assets/images/old drawing (4).jpg",
            "./assets/images/old drawing (6).jpg",
          ],
        },
        {
          id: "oost-poster-a0-01",
          title: "oostposterexport_physical_size_A0",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/oostposterexport_physical_size_A0.0.jpg",
            "./assets/images/oostposterexport_physical_size_A0.1.jpg",
            "./assets/images/oostposterexport_physical_size_A0.2.jpg",
            "./assets/images/oostposterexport_physical_size_A0.3.jpg",
            "./assets/images/oostposterexport_physical_size_A0.4.jpg",
          ],
        },
        
        {
          id: "patreon-waves-01",
          title: "wallpaper_waves",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/patreon_wallpaper_waves.0.jpg",
            "./assets/images/patreon_wallpaper_waves.1.jpg",
            "./assets/images/patreon_wallpaper_waves.2.jpg",
            "./assets/images/patreon_wallpaper_waves.3.jpg",
            "./assets/images/patreon_wallpaper_waves.4.jpg",
            "./assets/images/patreon_wallpaper_waves.5.jpg",
            "./assets/images/patreon_wallpaper_waves.6.jpg",
          ],
        },
        {
          id: "plotterframes-01",
          title: "plotterframes",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/plotterframes.0.jpg",
            "./assets/images/plotterframes.1.jpg",
            "./assets/images/plotterframes.2.jpg",
          ],
        },
        {
          id: "structural-variations-01",
          title: "structural variations",
          category: "VISUAL RESEARCH",
          color: "saffron",
          images: [
            "./assets/images/structural variations.0.jpg",
            "./assets/images/structural variations.1.jpg",
            "./assets/images/structural variations.2.jpg",
            "./assets/images/structural variations.3.jpg",
            "./assets/images/structural variations.4.jpg",
            "./assets/images/structural variations.5.jpg",
            "./assets/images/structural variations.6.jpg",
          ],
        },


        // TouchDesigner Tutorials (sorted alphabetically by title)
        {
          id: "audiodevout-audio-reactive-text-animations",
          title: "Audio-Reactive Text Animations - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Create text animations that react to audio input in TouchDesigner.",
          fullDescription:
            "Tutorial on building audio-reactive text animations in TouchDesigner, syncing typography and motion to sound.",
          medium: "TouchDesigner, audioreactive visuals, typography",
          tags: ["TouchDesigner", "audioreactive", "text", "animation", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=sDOvmhu6DWY"],
        },
        {
          id: "audiodevout-audioreactive-doodle-geometry-instancing",
          title: "Audioreactive Doodle with Geometry Instancing in TouchDesigner - Behind The Network",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Behind-the-scenes look at an audioreactive doodle project using geometry instancing.",
          fullDescription:
            "A behind-the-network exploration of creating audioreactive visuals with geometry instancing in TouchDesigner.",
          medium: "TouchDesigner, audioreactive visuals, geometry instancing",
          tags: ["TouchDesigner", "audioreactive", "instancing", "behind the network"],
          videos: ["https://www.youtube.com/watch?v=Hk0uF7s-DjU"],
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
          id: "audiodevout-basic-uv-mapping-noise-sculpting",
          title: "Basic UV Mapping and Noise Sculpting in Touchdesigner (Tutorial)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Introduction to UV mapping and noise sculpting techniques in TouchDesigner.",
          fullDescription:
            "Foundational tutorial covering basic UV mapping and noise sculpting workflows in TouchDesigner.",
          medium: "TouchDesigner, UV mapping, procedural geometry",
          tags: ["TouchDesigner", "UV mapping", "noise sculpting", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=4rm5dcoQHBc"],
        },
        {
          id: "audiodevout-chop-top-chop-sop",
          title: "CHOP-TOP-CHOP-SOP - Simple Multioperator Processing on TouchDesigner",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Simple multioperator processing workflow connecting CHOPs, TOPs, and SOPs.",
          fullDescription:
            "Tutorial on chaining CHOP, TOP, and SOP operators for simple multioperator processing in TouchDesigner.",
          medium: "TouchDesigner, operator chains, data flow",
          tags: ["TouchDesigner", "CHOP", "TOP", "SOP", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=ZhddPQfyN5A"],
        },
        {
          id: "audiodevout-contour-experiments",
          title: "Contour Experiments in TouchDesigner",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Experiments with contour-based visual effects in TouchDesigner.",
          fullDescription:
            "Exploring contour detection and contour-based visual effects in TouchDesigner.",
          medium: "TouchDesigner, contour detection, visual effects",
          tags: ["TouchDesigner", "contour", "visual effects", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=DPWZV4OTAn4"],
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
          id: "audiodevout-creating-smoky-particle-effects",
          title: "Creating Smoky Particle Effects with ParticlesGPU - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Create smoky, atmospheric particle effects using ParticlesGPU.",
          fullDescription:
            "Tutorial on building smoky particle effects and atmospheric visuals with ParticlesGPU in TouchDesigner.",
          medium: "TouchDesigner, ParticlesGPU, particle effects",
          tags: ["TouchDesigner", "ParticlesGPU", "particles", "smoke", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=7A6_PazyKSw"],
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
          id: "audiodevout-generative-soundscapes-data-driven",
          title: "Generative Soundscapes and Data Driven Signal Processing - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Build generative soundscapes using data-driven signal processing in TouchDesigner.",
          fullDescription:
            "Tutorial on creating generative soundscapes and applying data-driven signal processing techniques in TouchDesigner.",
          medium: "TouchDesigner, generative audio, signal processing",
          tags: ["TouchDesigner", "generative", "soundscapes", "signal processing", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=lJMMNPUpK-w"],
        },
        {
          id: "audiodevout-geometric-iterations-behind-network",
          title: "Geometric Iterations - Behind the Network",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Behind-the-scenes look at geometric iteration techniques in TouchDesigner.",
          fullDescription:
            "A behind-the-network exploration of geometric iteration and procedural pattern generation in TouchDesigner.",
          medium: "TouchDesigner, procedural geometry, generative art",
          tags: ["TouchDesigner", "geometric", "iterations", "behind the network"],
          videos: ["https://www.youtube.com/watch?v=QG-Kluyuveg"],
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
          id: "audiodevout-noise-sculpting-part2",
          title: "Noise Sculpting in TouchDesigner - Part 2 (Tutorial)",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Second part of the noise sculpting series, building on foundational techniques.",
          fullDescription:
            "Part 2 of the noise sculpting series, continuing to explore procedural noise manipulation and geometry sculpting in TouchDesigner.",
          medium: "TouchDesigner, noise sculpting, procedural geometry",
          tags: ["TouchDesigner", "noise sculpting", "tutorial", "generative art"],
          videos: ["https://www.youtube.com/watch?v=p9TwiixKvXQ"],
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
          id: "audiodevout-noise-sculpting-part9",
          title: "Noise Sculpting in TouchDesigner (Part 9*) - Bubbles, Waves and Scene Switching",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Part 9 of the noise sculpting series: bubbles, waves, and scene switching techniques.",
          fullDescription:
            "Bubble effects, wave patterns, and scene switching in TouchDesigner.",
          medium: "TouchDesigner, noise sculpting, procedural visuals",
          tags: ["TouchDesigner", "noise sculpting", "bubbles", "waves", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=nQIwwmKPSqs"],
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
          id: "audiodevout-nvidia-flex-touchdesigner",
          title: "NVIDIA Flex in TouchDesigner: Real-Time Soft Body & Fluid Experiments",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Real-time soft body and fluid simulation using NVIDIA Flex in TouchDesigner.",
          fullDescription:
            "Tutorial on integrating NVIDIA Flex for real-time soft body and fluid simulation experiments in TouchDesigner.",
          medium: "TouchDesigner, NVIDIA Flex, physics simulation, fluids",
          tags: ["TouchDesigner", "NVIDIA Flex", "soft body", "fluid", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=6QdLMXyzyuY"],
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
          id: "audiodevout-procedural-crystal-video-effects",
          title: "Procedural Crystal-Like Video Effects - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Create crystal-like procedural video effects in TouchDesigner.",
          fullDescription:
            "Procedural crystal-like refraction and video treatment in TouchDesigner.",
          medium: "TouchDesigner, procedural effects, video effects",
          tags: ["TouchDesigner", "crystal", "procedural", "video effects", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=pc34xAXCRlg"],
        },
        {
          id: "audiodevout-procedural-grid-patterns",
          title: "Procedural Grid Patterns - TouchDesigner Tutorial",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Generate procedural grid patterns and geometric structures in TouchDesigner.",
          fullDescription:
            "Grid-based procedural geometry and patterning in TouchDesigner.",
          medium: "TouchDesigner, procedural patterns, generative art",
          tags: ["TouchDesigner", "grid", "procedural", "patterns", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=TbRtV-ix8RE"],
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
          id: "audiodevout-typewriter-effect",
          title: "Typewriter Effect in TouchDesigner - Free TOX FIle",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          description: "Create a typewriter text effect in TouchDesigner with free TOX file.",
          fullDescription:
            "Tutorial on building a typewriter text effect in TouchDesigner, with a free TOX file available for download.",
          medium: "TouchDesigner, text effects, typography",
          tags: ["TouchDesigner", "typewriter", "text", "TOX", "tutorial"],
          videos: ["https://www.youtube.com/watch?v=DMOS3fV_msc"],
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
            "Uses Habermas and Dahlgren’s public-sphere frameworks to argue that YouTube shifts television’s centralized, passive model toward participatory, decentralized dynamics—prosumers, niche communities, democratic interaction—while remaining embedded in corporate structures and redefining how meaning and representation are produced.",
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
            "Case study: Karacus Maracus 2021 (Goa). Sound, technology, and dance as sites where normative masculinity loosens—via Pini’s cyborg/nomad lenses, tracing improvisation, trance, and collective desire as embodied politics.",
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
          "Talk at the 5th ECT Lab+ (Baltan Laboratories): Symmetrical Fictions—technology, contemporary art, and speculative research.",
        location: "Eindhoven, NL",
        role: "Talk/Presentation",
        venue: "Baltan Laboratories",
        images: ["./assets/images/ect5.png",
          "./assets/images/ect.jpg",
          "./assets/images/ect1.jpg",
          "./assets/images/ect2.jpg",
        ],
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
          "Urban Arts Tour — Extended Living Room at Forum/Nieuwe Markt. Showed the rain-stick piece from Instruments for Becoming outdoors as a slow, weather-like kinetic work in public space.",
        location: "Groningen, NL",
        role: "Kinetic Sculpture",
        venue: "Nieuwe Markt/Forum",
        images: [
            "./assets/images/rain-stick-4.jpg",
            "./assets/images/rain-stick-5.jpg",
            "./assets/images/rain-stick-6.jpg"
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
          "Group show on perception and reactive environments. Rain Reminders (Instruments for Becoming) installed as a motor-driven, audience-responsive kinetic work.",
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
          "Experimental A/V night at Minerva. Gesture-controlled system: performer movement drives live sound and image—body and patch read as one environment.",
        location: "Groningen, NL",
        role: "AV Performance",
        venue: "Minerva Academy",
        images: ["./assets/images/fever-dream-poster.jpg"],
        videos: ["https://www.youtube.com/watch?v=sSkNm3GcGq8"],
      },
      {
        id: "ddd-error-failure-option-pt3",
        title: "Diverse Digital Dimensions: Error – Failure Is an Option, Part Three",
        date: "March 2025",
        description:
          "NAIP European Music Masters (Prince Claus Conservatoire, Iceland University of the Arts) × MADTech (Frank Mohr Institute): four Live Labs on co-making in an open-space model, then a five-day residency at Grand Theatre Groningen (in-person and remote work).",
        location: "Groningen, NL",
        role: "Residency and Group Presentation",
        venue: "Grand Theatre Groningen",
        images: [],
        urls: {
          link: "https://www.grandtheatregroningen.nl/en/programma/archief/diverse-digital-dimensions-error-failure-is-an-option-part-three"
        },
        videos: [],
      },
      {
        id: "contemporary-art-lecture",
        title: "On Art and Contemporary Artistic Practice",
        date: "February 2025",
        description:
          "Lecture on contemporary practice in the Netherlands and Western Europe—strategies, collaboration, and examples from my own work at the intersection of technology, performance, and public contexts.",
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
    description: `Atharva Gupta is a sound and audiovisual artist-researcher who builds objects, instruments, systems, and situations from a hands-on relationship with technology. Practice starts with making and the questions that follow; it spans sound and kinetic sculpture, audiovisual performance, code, game mods, and what lies between. Work keeps returning to perception, social organisation, and how we process the world.`,
    credentials: [],
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
            degree: "Bachelor of Arts (BA), Triple Major, Psychology, Sociology and Literature",
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
            title: "Workshop Assistant - Electronics and Programming",
            company: "Minerva Academy (Hanze University of Applied Sciences)",
            location: "Groningen, NL",
            period: "Oct 2025 - Present",
            responsibilities: [
              // "Supporting with programming, electronics, and fabrication tools",
              // "Guiding students in using fabrication software, tools and technologies",
              // "Assistance with TouchDesigner, Arduino, and coding workflows",
              // "Maintainence of workspace and equipment",
              // "Creatiom instructional materials",
            ],
          },


          {
            title: "Freelance Art Producer",
            company: "Art Researcher and Educator",
            location: "Groningen, NL",
            period: "Oct. 2023 - Present",
            responsibilities: [
              // "TouchDesigner tutorials on YouTube @audiodevout",
              // "Music production and sound design @asymmetrica",
              // "Visual Jockey (VJ)",
              // "Sound Design for Art Installations",
              // "Creative Coding Workshops",
            ],
          },
          {
            title: "Research and Development Intern",
            company: "Broedplaats De Campagne",
            location: "Groningen, NL",
            period: "Feb. 2023 – Oct. 2023",
            responsibilities: [
            //   "Worked on large-scale art installations under Artist and Theatre Professional Chantalla Pleiter.",
            //   "Contributed to the creation and presentation of 4 different projects related to XR technologies and sound design at festivals like Noorderzon Performing Arts Festival and Expeditie Next.",
            ],
          },
          {
            title: "Research Assistant",
            company: "University of Groningen",
            location: "Groningen, NL",
            period: "Oct. 2022 – Aug. 2023",
            responsibilities: [
            //   "Research assistant for the project 'Listen Here Now' - A study into the urban soundscapes of Groningen by Rudolf Agricola School of Sustainable Development",
            //   "Oversaw core project responsibilities, participant communication, logistics, and marketing. Also including audio-visual logistics, procurement, and maintenance of equipment.",
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
      },
    },
  }

  // Derive a unified works array for normalized access
  const works = []

  const pushProjects = (items, type, status) => {
    if (!Array.isArray(items)) return
    items.forEach((item) => {
      if (!item || !item.id) return
      works.push({
        id: item.id,
        title: item.title,
        type,
        status: status || null,
        medium: item.medium || null,
        dimensions: item.dimensions || null,
        descriptionShort: item.description || null,
        descriptionLong: item.fullDescription || item.description || null,
        images: Array.isArray(item.images) ? item.images : [],
        videos: Array.isArray(item.videos) ? item.videos : [],
        bandcampTracks: Array.isArray(item.bandcampTracks) ? item.bandcampTracks : [],
        tags: item.tags || null,
        themes: item.themes || null,
        urls: item.urls || null,
        featured: Boolean(item.featured),
        showInMainGallery: item.showInGallery !== false,
        mainGalleryLimit:
          typeof item.num_images_maingallery === "number" && item.num_images_maingallery > 0
            ? item.num_images_maingallery
            : null,
      })
    })
  }

  // Map legacy project groups into unified works
  pushProjects(portfolioData.projects.installations, "installation", "major")
  pushProjects(portfolioData.projects.performance, "performance", "major")
  pushProjects(portfolioData.projects.soundInstallations, "sound", "major")
  pushProjects(portfolioData.projects.drawings, "visual", "experiment")
  pushProjects(portfolioData.projects.writing, "text", "major")

  portfolioData.works = works

  // Normalize exhibitions with derived year/month where possible
  portfolioData.exhibitions = portfolioData.exhibitions.map((ex) => {
    const normalized = { ...ex }
    if (ex.date && typeof ex.date === "string") {
      const yearMatch = ex.date.match(/(20\d{2})/)
      normalized.year = yearMatch ? parseInt(yearMatch[1], 10) : null
    } else {
      normalized.year = null
    }
    return normalized
  })

  // Make data available globally with error handling
  if (typeof window !== "undefined") {
    window.portfolioData = portfolioData
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