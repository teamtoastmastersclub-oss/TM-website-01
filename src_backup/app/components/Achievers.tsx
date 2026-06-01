import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Trophy } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Achievers() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const achievers = [
    {
      name: "Priya Sharma",
      title: "Best Speaker 2025",
      description: "Outstanding performance in Table Topics",
      image: "https://images.unsplash.com/photo-1766722906733-609eebf3b63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF3YXJkJTIwd2lubmVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mzk2NDQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Arjun Reddy",
      title: "Leadership Excellence Award",
      description: "Exceptional club management and mentorship",
      image: "https://images.unsplash.com/photo-1766722906733-609eebf3b63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF3YXJkJTIwd2lubmVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mzk2NDQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Sneha Patel",
      title: "Most Improved Member",
      description: "Remarkable growth in communication skills",
      image: "https://images.unsplash.com/photo-1766722906733-609eebf3b63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF3YXJkJTIwd2lubmVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mzk2NDQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      name: "Rahul Verma",
      title: "District Competition Winner",
      description: "First place in humorous speech contest",
      image: "https://images.unsplash.com/photo-1766722906733-609eebf3b63a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGF3YXJkJTIwd2lubmVyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3Mzk2NDQ1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <section id="team" ref={ref} className="py-10 md:py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Achievers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-6">
            Celebrating excellence and recognizing outstanding contributions to our club
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievers.map((achiever, index) => (
            <motion.div
              key={achiever.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden">
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Trophy Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>

                  {/* Profile Image */}
                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur-xl opacity-20" />
                      <ImageWithFallback
                        src={achiever.image}
                        alt={achiever.name}
                        className="relative w-full h-48 object-cover rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-1">{achiever.name}</h3>
                  <p className="text-yellow-400 text-sm font-medium mb-2">{achiever.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{achiever.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
