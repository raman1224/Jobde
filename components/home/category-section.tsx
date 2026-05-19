// components/home/category-section.tsx
"use client"

import { motion } from "framer-motion"
import { Building2, Briefcase, MapPin, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CategorySectionProps {
  categories: any
  onCategoryClick: (type: string, value: string) => void
  activeCategory: { type: string; value: string } | null
}

export function CategorySection({ categories, onCategoryClick, activeCategory }: CategorySectionProps) {
  const categoryGroups = [
    { title: "Top Companies", type: "company", icon: Building2, items: categories.companies || [], color: "from-blue-500 to-cyan-500" },
    { title: "Popular Industries", type: "industry", icon: Briefcase, items: categories.industries || [], color: "from-orange-500 to-red-500" },
    { title: "热门职位", type: "hot", icon: TrendingUp, items: categories.hot || [], color: "from-purple-500 to-pink-500" },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Jobs by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Browse thousands of jobs by company, industry, or location
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {categoryGroups.map((group, groupIdx) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIdx * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center`}>
                  <group.icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{group.title}</h3>
              </div>

              <div className="space-y-3">
                {group.items.slice(0, 5).map((item: any, idx: number) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: groupIdx === 0 ? -20 : groupIdx === 1 ? 0 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 5 }}
                    onClick={() => onCategoryClick(group.type, item.name)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 group",
                      activeCategory?.type === group.type && activeCategory?.value === item.name
                        ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center`}>
                        <group.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold group-hover:text-blue-600 transition-colors">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.count} jobs</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}