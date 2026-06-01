import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

export function OurStory() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const [mission, setMission] = useState({
    title: "Building Leaders,\nOne Speech at a Time",
    description1: "Since our inception, KLECET Toastmasters Club has been dedicated to nurturing confident communicators and inspiring leaders. We believe that effective communication is the cornerstone of success in every aspect of life.",
    description2: "Through structured programs, constructive feedback, and a supportive community, we empower our members to overcome their fears, articulate their ideas, and lead with conviction.",
    image: "https://images.unsplash.com/photo-1541178735493-479c1a27ed24?q=80&w=800&auto=format&fit=crop",
    visionText: "To be a premier platform for developing world-class communicators.",
    missionText: "Provide a supportive environment for practicing communication skills."
  });

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "http://localhost:5000") + '/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.mission) {
          setMission(data.mission);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" ref={ref} className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                <img 
                  src={mission.image} 
                  alt="Toastmasters Club Meeting" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 -z-10" />
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="mb-6">
                <span className="text-sm uppercase tracking-widest text-gray-500">Our Story</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight whitespace-pre-wrap">
                {mission.title}
              </h2>

              <div className="space-y-6 text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                <p>{mission.description1}</p>
                <p>{mission.description2}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Vision</h3>
                  <p className="text-gray-600 text-sm">
                    {mission.visionText}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Mission</h3>
                  <p className="text-gray-600 text-sm">
                    {mission.missionText}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
