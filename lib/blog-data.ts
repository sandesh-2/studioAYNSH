export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  category: string
  date: string
  readTime: string
  heroImage: string
  heroAlt: string
  excerpt: string
  content: BlogSection[]
}

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'subheading' | 'quote' | 'list'
  text?: string
  items?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'mastering-golden-hour-wedding-photography',
    title: 'Mastering the Golden Hour in Wedding Photography',
    subtitle: 'How one fleeting window of light transforms ordinary moments into timeless art',
    category: 'Wedding',
    date: 'June 18, 2025',
    readTime: '6 min read',
    heroImage: '/images/blog-golden-hour.png',
    heroAlt: 'Bride standing in a palace doorway bathed in golden hour light',
    excerpt:
      'The 45 minutes after sunset hold a kind of magic that no studio light can replicate. Here is how we chase, read, and harness that light for wedding photography.',
    content: [
      {
        type: 'paragraph',
        text: 'Every wedding photographer has a favourite hour. For us at Studio AYNSH, it is the golden hour — that brief window when the sun dips below the horizon and the sky turns into a canvas of amber, rose, and deep violet. It is the light that makes a bride glow without a single softbox, and it is the light that elevates a photograph from documentation into art.',
      },
      {
        type: 'heading',
        text: 'Understanding the Quality of Light',
      },
      {
        type: 'paragraph',
        text: 'Golden hour light is directional, warm, and soft. Because the sun is near the horizon, light travels through more atmosphere, scattering the harsh blue wavelengths and leaving behind a warmth that is naturally flattering on skin tones — particularly the deep, luminous complexions so common in Indian bridal photography. The long shadows it casts add depth and dimension to any composition.',
      },
      {
        type: 'paragraph',
        text: 'Unlike the harsh midday sun, which flattens faces and forces subjects to squint, golden hour light wraps around subjects. Shoot into it and you get a rim-lit silhouette. Shoot with it behind you and the subject is bathed in even, flattering warmth. The versatility within those 45 minutes is extraordinary.',
      },
      {
        type: 'heading',
        text: 'Preparation Is Everything',
      },
      {
        type: 'paragraph',
        text: 'Chasing golden hour is not luck — it is meticulous preparation. Before every wedding we do three things. We calculate the exact sunset time for that location and date. We scout the venue in advance and identify three to four positions where the light will fall at its best angle. And we brief the couple and the wedding planner so that the portrait session is scheduled to begin 20 minutes before sunset, not after.',
      },
      {
        type: 'list',
        items: [
          'Use a sun-tracking app (we prefer PhotoPills) to visualise where the sun will set relative to the venue.',
          'Identify clean backdrops — archways, doorways, open courtyards — that frame the couple without clutter.',
          'Communicate the timing clearly with the wedding planner so portraits are not delayed by family group shots.',
          'Bring a reflector to fill in shadows on the face while the background is lit by the sky.',
          'Shoot in RAW — golden hour light shifts quickly and you want the latitude to preserve highlight detail in post.',
        ],
      },
      {
        type: 'heading',
        text: 'Reading the Light on the Day',
      },
      {
        type: 'paragraph',
        text: 'No two golden hours are alike. A partly cloudy evening can produce more dramatic colour than a perfectly clear sky, as clouds catch and scatter the last light in unexpected ways. On fully overcast days, the light diffuses beautifully but the warmth disappears — in those cases we lean into moodier, cooler tones and let the drama of the architecture carry the image.',
      },
      {
        type: 'quote',
        text: 'The camera is an instrument that teaches people how to see without a camera. — Dorothea Lange',
      },
      {
        type: 'paragraph',
        text: 'The ability to read available light is a skill that takes years to develop. At Studio AYNSH, every session we shoot contributes to that ongoing education. Each venue, each season, each time of year teaches us something new about how light behaves in our region of Uttar Pradesh — and that accumulated knowledge is what we bring to your wedding day.',
      },
      {
        type: 'heading',
        text: 'Technical Settings for Golden Hour',
      },
      {
        type: 'list',
        items: [
          'Shoot wide open (f/1.8 – f/2.8) to separate the couple from the background and maximise the bokeh of the warm background light.',
          'Set white balance manually to around 5500–6000K to preserve the warmth, or shoot in Auto WB and correct in Lightroom.',
          'Use exposure compensation (+0.3 to +0.7) to expose for the faces rather than the bright sky behind.',
          'Enable silent shutter to avoid disrupting quiet, intimate moments during portraits.',
          'Switch to continuous autofocus (AI Servo on Canon, C-AF on Fuji) for moving subjects in low light.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Golden hour is generous, but it is also unforgiving in its brevity. The photographers who make the most of it are the ones who have done the work long before the sun begins to fall. Preparation, instinct, and the willingness to move quickly — those are the real tools of the golden hour photographer.',
      },
    ],
  },
  {
    slug: 'best-pre-wedding-locations-gorakhpur',
    title: '7 Breathtaking Pre-Wedding Locations Near Gorakhpur',
    subtitle: 'A curated guide to the most cinematic backdrops within driving distance of the city',
    category: 'Pre-Wedding',
    date: 'May 9, 2025',
    readTime: '5 min read',
    heroImage: '/images/blog-prewedding-locations.png',
    heroAlt: 'Couple silhouette at sunrise near ancient ruins with misty light',
    excerpt:
      'You do not need to travel to Rajasthan for a cinematic pre-wedding shoot. These seven locations within reach of Gorakhpur deliver drama, romance, and timeless beauty.',
    content: [
      {
        type: 'paragraph',
        text: 'One of the most common questions we receive at Studio AYNSH is about location. Couples see the sweeping palace backdrops of Udaipur and assume that a truly cinematic pre-wedding shoot requires long-haul travel. It does not. The landscape around Gorakhpur is richer than most people realise — and we have spent years scouting every corner of it.',
      },
      {
        type: 'heading',
        text: '1. Kushinargar — Ancient Light, Timeless Backdrops',
      },
      {
        type: 'paragraph',
        text: 'Just 53 kilometres from Gorakhpur, Kushinagar is one of the most spiritually significant Buddhist sites in the world. The ancient stupas and the Mahaparinirvana Temple provide extraordinary architectural backdrops. At dawn, when the mist rises off the surrounding fields and the golden temple stone catches the first light, it is genuinely otherworldly.',
      },
      {
        type: 'heading',
        text: '2. Ramgarh Tal Lake — Mirror Reflections',
      },
      {
        type: 'paragraph',
        text: 'This large urban lake in the heart of Gorakhpur transforms at sunrise. The still water creates perfect mirror reflections of the sky, and the surrounding parkland offers clean, uncluttered foregrounds. We have produced some of our most minimalist, graphic compositions here — couples reflected in near-perfect symmetry against a burning sky.',
      },
      {
        type: 'heading',
        text: '3. Geeta Press and Old City Ghats',
      },
      {
        type: 'paragraph',
        text: 'For couples who want warmth, colour, and the layered texture of old India, the ghats and narrow lanes of old Gorakhpur deliver. Worn terracotta walls, colourful doorways, and the dappled light that filters through ancient trees create a completely different mood from natural landscape shoots.',
      },
      {
        type: 'heading',
        text: '4. Sonauliya and Surrounding Farmlands',
      },
      {
        type: 'paragraph',
        text: 'The mustard fields that bloom between November and February are among the most photogenic landscapes in the region. Vast swathes of deep yellow against the blue winter sky, with the occasional ancient banyan tree providing shade and structure. This is where we shoot our most romantic, painterly pre-wedding sessions.',
      },
      {
        type: 'heading',
        text: '5. Valmiki National Park Periphery — Forest Light',
      },
      {
        type: 'paragraph',
        text: 'For couples who want something adventurous and wild, the forest roads and clearings near the Valmiki Tiger Reserve offer filtered jungle light that is unlike anything else. Dappled canopy light creates natural spotlighting effects that are impossible to recreate in a studio.',
      },
      {
        type: 'quote',
        text: 'Great photography is about depth of feeling, not depth of field. — Peter Adams',
      },
      {
        type: 'heading',
        text: '6. Historic Temples of Deoria District',
      },
      {
        type: 'paragraph',
        text: 'The older temples scattered across the Deoria district, about an hour from Gorakhpur, offer carved stone facades and ancient courtyard architecture that photograph magnificently in afternoon light. The textures and details in the stonework create extraordinary depth in close-up compositions.',
      },
      {
        type: 'heading',
        text: '7. The Open Fields at Blue Hour',
      },
      {
        type: 'paragraph',
        text: 'Sometimes the most powerful backdrop is the simplest one. The open agricultural plains around Gorakhpur at blue hour — when the sky turns a deep cobalt and the horizon glows — offer a canvas on which a couple becomes the sole subject. No competing architecture, no distracting colour. Just two people, light, and sky.',
      },
      {
        type: 'paragraph',
        text: 'Every location tells a different story. When we plan a pre-wedding shoot, we always begin with a conversation about the couple — their personalities, their shared story, the feeling they want the images to carry. The location follows from that conversation, not the other way around.',
      },
    ],
  },
  {
    slug: 'how-to-prepare-for-your-photography-session',
    title: 'How to Prepare for Your Photography Session',
    subtitle: 'A practical, honest guide from the photographer\'s perspective — what makes a session extraordinary',
    category: 'Tips & Guides',
    date: 'April 3, 2025',
    readTime: '7 min read',
    heroImage: '/images/blog-prepare-shoot.png',
    heroAlt: 'Bride getting ready in a luxury hotel suite with natural window light',
    excerpt:
      'The best photographs are the result of preparation that happens long before the camera appears. Here is everything you need to know to make your session exceptional.',
    content: [
      {
        type: 'paragraph',
        text: 'After years of photographing hundreds of sessions — from intimate portraits to grand destination weddings — we have observed one consistent truth: the clients who leave with the most extraordinary photographs are the ones who arrived prepared. Not in the stiff, over-rehearsed sense, but prepared in the way that allows them to be genuinely present in front of the camera.',
      },
      {
        type: 'heading',
        text: 'Start with a Clear Vision',
      },
      {
        type: 'paragraph',
        text: 'Before your session, spend time gathering references. Not to copy them, but to understand what kind of mood and feeling resonate with you. Do you lean toward dark and dramatic, or light and airy? Candid and documentary, or posed and editorial? Share these references with us during your consultation. They help us understand your aesthetic language and plan the session accordingly.',
      },
      {
        type: 'heading',
        text: 'What to Wear',
      },
      {
        type: 'paragraph',
        text: 'Clothing choices have an enormous impact on final photographs. A few principles to guide you: choose colours that complement the location rather than compete with it. Deep jewel tones and neutrals photograph beautifully in most environments. Avoid large graphic prints or logos, which date a photograph quickly. Ensure your clothing fits well — clothes that pull or bunch are distracting in images.',
      },
      {
        type: 'list',
        items: [
          'For outdoor shoots: layer textures — linen, cotton, silk — they catch light beautifully.',
          'For studio sessions: deep tones (burgundy, navy, forest green, black) against a light background create elegant contrast.',
          'Avoid head-to-toe matching with your partner — complementary tones are more dynamic than identical outfits.',
          'Bring a second outfit if the session is longer than two hours — it adds variety and gives you a natural energy reset.',
          'Accessorise thoughtfully. A single elegant statement piece is more powerful than multiple competing accessories.',
        ],
      },
      {
        type: 'heading',
        text: 'The Morning of Your Session',
      },
      {
        type: 'paragraph',
        text: 'Arrive rested. This sounds obvious but is more important than any wardrobe decision. Tired eyes, tension in the jaw, the subtle anxiety of a rushed morning — all of it registers on camera. Give yourself more time than you think you need to get ready. Eat a proper meal. If your session is scheduled at sunrise, sleep early the night before.',
      },
      {
        type: 'quote',
        text: 'You do not take a photograph. You make it. — Ansel Adams',
      },
      {
        type: 'heading',
        text: 'Being in Front of the Camera',
      },
      {
        type: 'paragraph',
        text: 'Camera shyness is one of the most common concerns we hear. Here is the truth: almost everyone is uncomfortable in front of a camera initially. The first ten minutes of any session are typically the least natural — for everyone, not just you. We know this, and we plan for it. The first images we shoot are rarely the ones that end up in the final gallery; they are the warm-up.',
      },
      {
        type: 'paragraph',
        text: 'Our approach is to give you things to do rather than poses to hold. Walk toward me. Whisper something in their ear. Look at the view, not at me. Turn toward the light. Movement and action almost always yield more natural results than static poses. Trust the direction and allow yourself to feel rather than perform.',
      },
      {
        type: 'heading',
        text: 'For Couples: How to Connect on Camera',
      },
      {
        type: 'list',
        items: [
          'Touch is the foundation of connection in couple photographs. Hold hands, not for the camera, but because it grounds you both.',
          'Look at each other, not at the camera, unless specifically directed. The best photographs capture genuine attention between two people.',
          'Talk to each other during the session. Share a memory. Tell a joke. Laughter is impossible to fake and it transforms a photograph.',
          'Do not worry about whether you look good — focus on how you feel. The camera will take care of the rest.',
          'Trust the photographer. Surrender the urge to control the outcome and be present in the moment.',
        ],
      },
      {
        type: 'paragraph',
        text: 'The most extraordinary photographs are never manufactured. They are discovered — in a glance, a laugh, an unguarded moment of genuine connection. Our role as photographers is to create the conditions in which those moments can happen, and to be ready when they do.',
      },
    ],
  },
  {
    slug: 'understanding-portrait-lighting',
    title: 'Understanding Portrait Lighting: A Photographer\'s Primer',
    subtitle: 'Breaking down the five classical lighting patterns and when to use each one',
    category: 'Photography',
    date: 'March 12, 2025',
    readTime: '8 min read',
    heroImage: '/images/blog-portrait-lighting.png',
    heroAlt: 'Studio portrait setup with dramatic Rembrandt lighting',
    excerpt:
      'Light is the language of photography. Understanding the five classical portrait lighting patterns gives you the vocabulary to say something precise with every image you create.',
    content: [
      {
        type: 'paragraph',
        text: 'Every portrait photograph is, at its core, a study in how light falls on a human face. The mood, the drama, the flattery or the brutality of a portrait is determined entirely by the angle, quality, and intensity of the light source. Before you can develop a personal style, you must first understand the classical patterns that define the craft.',
      },
      {
        type: 'heading',
        text: '1. Rembrandt Lighting',
      },
      {
        type: 'paragraph',
        text: 'Named after the Dutch master painter, Rembrandt lighting is perhaps the most dramatic and historically revered portrait pattern. A single light source is placed at roughly 45 degrees to the subject and slightly above eye level. The defining characteristic is a small triangle of light on the shadow side of the face, just below the eye on the cheekbone. It creates profound depth and shadow, giving subjects a sense of weight and gravitas.',
      },
      {
        type: 'paragraph',
        text: 'Rembrandt lighting is particularly powerful for character studies, older subjects whose faces carry the texture of lived experience, and any subject where you want to convey strength, wisdom, or depth. It is less flattering for subjects who want a softer, more commercial look.',
      },
      {
        type: 'heading',
        text: '2. Loop Lighting',
      },
      {
        type: 'paragraph',
        text: 'Loop lighting is the workhorse of professional portrait photography. The light source is placed slightly above eye level and slightly to one side — typically 30 to 45 degrees. It creates a small loop-shaped shadow descending from the nose toward the corner of the mouth. This pattern is versatile, flattering on most face shapes, and the foundation of much commercial and lifestyle photography.',
      },
      {
        type: 'heading',
        text: '3. Butterfly Lighting',
      },
      {
        type: 'paragraph',
        text: 'Also called Paramount lighting after the glamour portraits produced by Hollywood studios in the 1930s and 40s, butterfly lighting places the main light source directly in front of the subject and above, creating a butterfly-shaped shadow beneath the nose. It emphasises cheekbones, reduces under-eye circles, and adds a sense of glamour. It is the preferred pattern for many high fashion and beauty photographers.',
      },
      {
        type: 'quote',
        text: 'Light makes photography. Embrace light. Admire it. Love it. But above all, know light. — George Eastman',
      },
      {
        type: 'heading',
        text: '4. Split Lighting',
      },
      {
        type: 'paragraph',
        text: 'Split lighting places the light source directly to one side of the subject, at 90 degrees. The result is a face divided cleanly into equal halves — one fully lit, one in shadow. It is the most dramatic of the classical patterns, creating a sense of mystery, duality, or inner conflict. It is used extensively in conceptual portraiture, fine art photography, and editorial work where the image is making a statement.',
      },
      {
        type: 'heading',
        text: '5. Broad vs. Short Lighting',
      },
      {
        type: 'paragraph',
        text: 'Broad and short lighting are not patterns in themselves but modifiers that apply to any of the above. Broad lighting means the main light falls on the side of the face turned toward the camera — it widens and opens the face, adding weight and presence. Short lighting means the main light falls on the side of the face turned away from the camera — it narrows and slims the face, adding drama and definition. Understanding this distinction allows you to use lighting to shape and sculpt the face rather than simply illuminate it.',
      },
      {
        type: 'heading',
        text: 'Quality of Light: Hard vs. Soft',
      },
      {
        type: 'list',
        items: [
          'Hard light comes from a small, distant source (direct sun, bare flash). It creates sharp-edged, high-contrast shadows. It is dramatic, graphic, and unforgiving.',
          'Soft light comes from a large source relative to the subject (overcast sky, large softbox, light bounced from a wall). It wraps around the subject and creates gradual, soft-edged shadows. It is flattering, dimensional, and more forgiving.',
          'The closer a large source is to the subject, the softer and more wrapping the light becomes.',
          'At Studio AYNSH, we prefer a blend: soft directional light that retains dimension without harsh contrast.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Mastering portrait lighting is a lifelong study. We continue to learn from every session we photograph — how a particular subject\'s bone structure interacts with light, how the quality of a window changes through the day, how to find the precise angle that makes someone look exactly as extraordinary as they are. It is endlessly fascinating work.',
      },
    ],
  },
  {
    slug: 'aerial-drone-photography-weddings',
    title: 'Why Drone Photography Is Redefining the Wedding Album',
    subtitle: 'The perspective that was once impossible is now one of the most powerful tools in luxury wedding coverage',
    category: 'Drone',
    date: 'February 5, 2025',
    readTime: '5 min read',
    heroImage: '/images/blog-drone-art.png',
    heroAlt: 'Aerial view of a grand wedding ceremony at a palace at golden sunset',
    excerpt:
      'The aerial perspective does more than show scale. It transforms a wedding into a spectacle, reveals patterns invisible from the ground, and creates images that will never be forgotten.',
    content: [
      {
        type: 'paragraph',
        text: 'Until relatively recently, photographing a wedding from the air required a helicopter, a substantial budget, and a great deal of co-ordination. Today, a skilled operator with a professional drone can capture perspectives that were previously impossible — and those perspectives are changing what clients expect from their wedding coverage.',
      },
      {
        type: 'heading',
        text: 'What Aerial Photography Reveals',
      },
      {
        type: 'paragraph',
        text: 'From the ground, even the grandest wedding venue can appear fragmented. You see the mandap, or the aisle, or the guests — rarely all three at once in a single frame. From above, the full scale and choreography of the event becomes visible. The intricate floral arrangements that form geometric patterns when viewed from directly overhead. The procession that traces a winding path through the venue. The scale of a gathering that simply cannot be conveyed from ground level.',
      },
      {
        type: 'paragraph',
        text: 'For destination weddings in historic palaces, heritage hotels, or elaborate outdoor venues, drone footage adds a cinematic establishing shot that situates the entire event within its landscape. It is the difference between a close-up of a painting and stepping back to see it in context.',
      },
      {
        type: 'heading',
        text: 'The Technical Discipline of Drone Photography',
      },
      {
        type: 'paragraph',
        text: 'Drone photography is not simply a matter of flying a camera upward and pressing a button. The images that make people stop scrolling are the result of careful compositional thinking, precise timing, and a deep understanding of how light behaves differently at altitude. At Studio AYNSH, our drone operator holds a certified pilot licence and works within all applicable regulations — including obtaining all required flight permissions for venues and locations in advance.',
      },
      {
        type: 'list',
        items: [
          'Flight permissions are obtained in advance for all venues — never assumed.',
          'We conduct a pre-shoot site survey to identify potential obstacles, signal interference, and optimal flight paths.',
          'All footage is captured in a high-bitrate LOG profile for maximum post-processing latitude.',
          'We co-ordinate closely with the ground photography team to ensure aerial and ground coverage are fully synchronised.',
          'Battery capacity is managed carefully to ensure the drone is always airborne during the key moments.',
        ],
      },
      {
        type: 'heading',
        text: 'Drone and Ground Photography: A Unified Vision',
      },
      {
        type: 'paragraph',
        text: 'The most powerful wedding documentation uses aerial and ground coverage as complementary perspectives rather than independent ones. An establishing wide drone shot followed by an intimate ground-level close-up creates a cinematic rhythm that draws the viewer into the story. We think of drone photography not as an add-on to wedding coverage but as a distinct and essential layer of storytelling.',
      },
      {
        type: 'quote',
        text: 'Photography is the story I fail to put into words. — Destin Sparks',
      },
      {
        type: 'heading',
        text: 'When to Use Aerial Photography',
      },
      {
        type: 'list',
        items: [
          'The baraat procession, especially when it moves through a large outdoor space or heritage street.',
          'The phera ceremony — the bird\'s eye view of the sacred fire and the circling couple is profoundly cinematic.',
          'Venue reveals before guests arrive, capturing the full scale of the decoration.',
          'Group photographs — aerial group shots produce images that stand apart from any traditional group photo.',
          'Sunset portraits — a couple photographed against the vast painted sky from 30 metres up creates images of extraordinary scale.',
        ],
      },
      {
        type: 'paragraph',
        text: 'We are now at a moment where drone photography is expected at premium weddings — and clients who experience it for the first time are invariably transformed in their appreciation for what it adds. There is something about seeing your most important day from above that reframes the experience itself. You understand the scale of what happened. You see the love made visible in the gathering of people around you. That is powerful.',
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
