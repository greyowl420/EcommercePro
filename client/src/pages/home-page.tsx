import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590059390747-f20136c90018')", // Moroccan souk/tent shop image
            filter: "brightness(0.5)"
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white">
          <div className="max-w-2xl bg-black/30 p-8 rounded-lg backdrop-blur-sm">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Our Moroccan Souk
            </h1>
            <p className="text-xl mb-8">
              Step into our traditional marketplace, where the rich aromas of spices 
              blend with the sweetness of dates and dried fruits. Experience the 
              authentic flavors of Morocco.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-[#C17817] hover:bg-[#A65D03] text-white">
                Browse Our Souk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-[#FDF6E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-[#5C3D2E]">Our Treasures</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#F8B87E] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#5C3D2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-center text-[#5C3D2E]">Premium Dates</h3>
              <p className="text-[#8B5E3C] text-center">Nature's sweetest treasures, carefully selected</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#F8B87E] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#5C3D2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-center text-[#5C3D2E]">Aromatic Spices</h3>
              <p className="text-[#8B5E3C] text-center">The soul of Moroccan cuisine</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#F8B87E] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#5C3D2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4m16 0l-8 4m8 4l-8 4m8-4l-8 4m8-4v10M4 7l8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-center text-[#5C3D2E]">Dried Fruits</h3>
              <p className="text-[#8B5E3C] text-center">Sweet and nutritious delights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-16 bg-[#5C3D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[url('https://images.unsplash.com/photo-1590059390747-f20136c90018')] bg-cover bg-center rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#5C3D2E]/90 to-transparent p-12">
              <div className="max-w-xl text-white">
                <h2 className="text-3xl font-bold mb-4">Traditional Moroccan Specialties</h2>
                <p className="mb-6 text-lg">
                  Discover our carefully curated selection of authentic Moroccan delicacies,
                  from premium dates to aromatic spices, all sourced directly from local artisans.
                </p>
                <Link href="/products">
                  <Button variant="secondary" className="bg-white text-[#5C3D2E] hover:bg-white/90">
                    Explore Our Selection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}