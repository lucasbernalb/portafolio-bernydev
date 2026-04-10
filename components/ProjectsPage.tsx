"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const allProjects = [
  {
    id: 1,
    title: "BERNALFORGE",
    category: "E-Commerce Full Stack",
    description: "Plataforma de e-commerce para venta de herramientas con gestión de inventario y pedidos",
    tags: ["Next.js", "Supabase", "TypeScript"],
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    accent: "#6366f1",
    github: "https://github.com/lucasbernalb/ECOMMERCE-BERNALFORGE",
    demo: "https://bernalforge.vercel.app/",
    status: null,
    image: "/proyectos/bernalforge.jpg",
  },
  {
    id: 2,
    title: "Ameli Pastoreo",
    category: "Landing Page",
    description: "Landing page para venta de huevos artesanales con integración a WhatsApp para pedidos",
    tags: ["React", "Tailwind CSS", "Responsive"],
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    accent: "#f59e0b",
    github: "https://github.com/lucasbernalb/ameli-pastoreo",
    demo: "https://ameli-pastoreo.vercel.app/",
    status: null,
    image: "/proyectos/ameli.jpg",
  },
  {
    id: 3,
    title: "Solycell",
    category: "Tienda Online",
    description: "Tienda online especializada en reparación de hardware y venta de accesorios tecnológicos",
    tags: ["Next.js", "MercadoPago", "In Progress"],
    gradient: "from-emerald-600 via-cyan-600 to-blue-600",
    accent: "#10b981",
    github: "https://github.com/lucasbernalb/solycell",
    demo: "https://solycell.vercel.app/",
    status: "In Progress",
    image: "/proyectos/solycell.jpg",
  },
  {
    id: 4,
    title: "Reina Artura Andrea",
    category: "Galería de Arte",
    description: "Plataforma de venta de cuadros online con catálogo de obras artísticas",
    tags: ["Next.js", "Supabase", "MercadoPago"],
    gradient: "from-violet-600 via-fuchsia-600 to-purple-600",
    accent: "#8b5cf6",
    github: "https://github.com/lucasbernalb/reinaartura-andrea",
    demo: "https://reinaartura-andrea.vercel.app/",
    status: "In Progress",
    image: "/proyectos/reinaartura.jpg",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof allProjects)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle, ${project.accent}30 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      <div className="relative bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-zinc-700/80">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback to gradient if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const gradient = document.createElement('div');
                gradient.className = `absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40`;
                parent.appendChild(gradient);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="text-xs font-medium tracking-wider uppercase text-zinc-400">
              {project.category}
            </span>
            {project.status && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {project.status}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Demo
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-zinc-800/50 text-zinc-400 border border-zinc-700/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsPage() {
  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden bg-[#0A0A0F]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
              Proyectos
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400"
          >
            Una selección de mi trabajo y experimentos
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
